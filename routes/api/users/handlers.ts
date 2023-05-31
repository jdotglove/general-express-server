import axios from '../../../plugins/axios';

import {
  findOneArtist,
} from '../../../db/services/artist';
import {
  findOneUser,
  findOneUserAndUpdate,
  updateOneUser,
  User,
} from '../../../db/services/user';
import { redisClientDo } from '../../../plugins/redis';
import {
  parseUriForId,
  resolveArtistsInDatabase,
  resolvePlaylistsInDatabase,
  translateSpotifyTrackObject,
  translateSpotifyUserObject,
} from '../../../utils/spotify';
import { findOnePlaylist, Playlist } from '../../../db/services/playlist';
import {
  findOneTrack,
  findOneTrackAndUpdate,
} from '../../../db/services/track';
import mongoose from '../../../plugins/mongoose';

export const getUserTopArtists = async (req: any, res: any) => {
  const user = await findOneUser({
    _id: req.params.id,
  });
  const userTopArtists = await Promise.all(user.topArtists.map(
    async ({ reference }: { reference: mongoose.Types.ObjectId}) => {
    const foundArtist = await findOneArtist({
      _id: reference,
    });
    return foundArtist;
  }));
  
  res.status(200).send(userTopArtists).end();
  return;
}

export const getUserTopTracks = async (req: any, res: any) => {
  const user = await findOneUser({
    _id: req.params.id,
  });
  const userTopTracks = await Promise.all(user.topTracks.map(async (trackId: mongoose.Types.ObjectId) => {
    const foundTrack = await findOneTrack({
      _id: trackId,
    });
    return foundTrack;
  }));

  res.status(200).send(userTopTracks).end();
  return;
}

export const getUserPlaylists = async (req: any, res: any) => {
  let playlists: Playlist[];
  try {
    const user = await findOneUser({
      _id: req.params.id,
    });
    const userSpotifyId = parseUriForId(user.spotifyUri);

    const cachedSpotifyToken = await redisClientDo('get', `audionest:${user._id}:token`);
    if (req.body.spotifyToken || cachedSpotifyToken) {
      const { data: spotifyUserPlaylists } = await axios({
        method: 'get',
        url: `https://api.spotify.com/v1/users/${userSpotifyId}/playlists`,
        headers: { Authorization: `Bearer ${req.body.spotifyToken || cachedSpotifyToken}` },
      });

      playlists = await resolvePlaylistsInDatabase(spotifyUserPlaylists.items);
      await updateOneUser({
        _id: user._id,
      }, {
        $set: {
          playlists: playlists.map(({ _id }) => _id),
        },
      });
      await redisClientDo('set', `audionest:${user._id}:token`, req.body.spotifyToken || cachedSpotifyToken);
    } else {
      playlists = await Promise.all(user.playlists?.map(async (playlistId) => {
        const playlist = await findOnePlaylist({
          _id: playlistId,
        });
        await redisClientDo('set', `${playlist.spotifyUri}`, JSON.stringify(playlist));
        return playlist;
      }));
    }
    
    if (!playlists || playlists.length === 0) {
      res.status(404).send('Playlists Not Found').end();
      return;
    } else {
      res.status(200).send(playlists).end();
    }
  } catch (error: any) {
    console.error('Error retrieving playlists: ', error.message);
    res.status(500).send(error.message).end();
  }
  return;
};

export const loginUser = async (req: any, res: any) => {
  let user: User;
  try {
    const { data: spotifyUser } = await axios({
      method: 'get',
      url: 'https://api.spotify.com/v1/me',
      headers: { Authorization: `Bearer ${req.body.spotifyToken}` }
    });
    const { data: spotifyUserTopTracks } = await axios({
      method: 'get',
      url: 'https://api.spotify.com/v1/me/top/tracks',
      headers: { Authorization: `Bearer ${req.body.spotifyToken}` }
    });
    const { data: spotifyUserTopArtists } = await axios({
      method: 'get',
      url: 'https://api.spotify.com/v1/me/top/artists',
      headers: { Authorization: `Bearer ${req.body.spotifyToken}` }
    });
    console.log(spotifyUser)
    
    const databaseUserObject = translateSpotifyUserObject(spotifyUser);
    const userTopArtists = await resolveArtistsInDatabase(spotifyUserTopArtists.items);
    const userTopTracks = await Promise.all(spotifyUserTopTracks.items.map(async (track: any) => {
      const databaseTrackObject = await translateSpotifyTrackObject(track);
      const savedTopTrack = await findOneTrackAndUpdate({
        spotifyUri: databaseTrackObject.spotifyUri,
      }, {
        $set: databaseTrackObject,
      }, {
        returnNewDocument: true,
        upsert: true,
      });
      
      return savedTopTrack;
    }));
    user = await findOneUserAndUpdate({
      spotifyUri: databaseUserObject.spotifyUri,
    }, {
      $set: {
        ...databaseUserObject,
        topArtists: userTopArtists,
        topTracks: userTopTracks.map(({ _id }) => _id),
      },
    }, {
      returnNewDocument: true,
      upsert: true,
    });
    if (!user || !user.spotifyUri) {
      res.status(404).send('User Not Found').end();
    } else {
      await redisClientDo('set', `${user.spotifyUri}`, JSON.stringify(user));
      await redisClientDo('set', `audionest:${user._id}:token`, req.body.spotifyToken);
      res.status(200).send(user).end();
    }
  } catch (error: any) {
    console.error('Error Logging in user: ', error.message);
    res.status(500).send(error.message).end();
  }
  return;
};