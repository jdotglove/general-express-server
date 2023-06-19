import axios from '../../../plugins/axios';

import {
  findOneArtist,
} from '../../../db/services/artist';
import getOneUser from '../../../plugins/graphql/query/getOneUser';
import {
  graphQLRequest,
} from '../../../plugins/graphql';
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
import { Playlist } from '../../../db/services/playlist';
import {
  findOneTrack,
  findOneTrackAndUpdate,
} from '../../../db/services/track';
import mongoose from '../../../plugins/mongoose';

export const getUserTopArtists = async (req: any, res: any) => {
  try {
    // const { data: { data } } = await graphQLRequest({
    //   query: getOneUser,
    //   variables: {
    //     userId: req.params.id,
    //   },
    // });
    // let user = data?.getOneUser as User;
    const user = await findOneUser({
      _id: req.params.id,
    })
    const userTopArtists = await Promise.all(user.topArtists.map(
      async (topArtistId: mongoose.Types.ObjectId) => {
      const foundArtist = await findOneArtist({
        _id: topArtistId,
      });
      return foundArtist;
    }));
    
    res.status(200).send(userTopArtists).end();
  } catch (error: any) {
    res.status(500).send(error.message).end();
  }
  return;
}

export const getUserTopTracks = async (req: any, res: any) => {
  try {
    // const { data: { data } } = await graphQLRequest({
    //   query: getOneUser,
    //   variables: {
    //     userId: req.params.id,
    //   },
    // });
    // let user = data?.getOneUser as User;
    const user = await findOneUser({ _id: req.params.id })
    const userTopTracks = await Promise.all(user.topTracks.map(async (trackId: mongoose.Types.ObjectId) => {
      const foundTrack = await findOneTrack({
        _id: trackId,
      });
      return foundTrack;
    }));
  
    res.status(200).send(userTopTracks).end();
  } catch (error: any) {
    res.status(500).send(error.message).end();
  }
  return;
}

export const getUserPlaylists = async (req: any, res: any) => {
  let playlists: Playlist[];
  try {
    // const { data: { data } } = await graphQLRequest({
    //   query: getOneUser,
    //   variables: {
    //     userId: req.params.id,
    //   },
    // });
    // let user = data?.getOneUser as User;
    const user = await findOneUser({ _id: req.params.id })
    const userSpotifyId = parseUriForId(user.spotifyUri);

    // if (req.body.spotifyToken || cachedSpotifyToken) {
      const { data: spotifyUserPlaylists } = await axios({
        method: 'get',
        url: `https://api.spotify.com/v1/users/${userSpotifyId}/playlists`,
        headers: { Authorization: `Bearer ${req.query.token}` },
      });

      playlists = await resolvePlaylistsInDatabase(spotifyUserPlaylists.items, req.params.id);
      // await graphQLRequest({
      //   query: updateOneUser,
      //   variables: {
      //     userId: req.params.id,
      //     userPayload: {
      //       playlists: playlists.map(({ _id }) => _id.toString()),
      //     },
      //   },
      // });
      await updateOneUser({
        _id: req.params.id
      }, {
        playlists: playlists.map(({ _id }) => _id.toString()),
      })
    // } else {
    //   playlists = await Promise.all(user.playlists?.map(async (playlistId: string) => {
    //     const playlist = await findOnePlaylist({
    //       _id: playlistId,
    //     });
    //     await redisClientDo('set', `${playlist.spotifyUri}`, JSON.stringify(playlist));
    //     return playlist;
    //   }));
    // }
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
}

export const loginUser = async (req: any, res: any) => {
  let user: User;
  try {
    const { data: spotifyUser } = await axios({
      method: 'get',
      url: 'https://api.spotify.com/v1/me',
      headers: { Authorization: `Bearer ${req.query.token}` }
    });
    const { data: spotifyUserTopTracks } = await axios({
      method: 'get',
      url: 'https://api.spotify.com/v1/me/top/tracks',
      headers: { Authorization: `Bearer ${req.query.token}` }
    });
    const { data: spotifyUserTopArtists } = await axios({
      method: 'get',
      url: 'https://api.spotify.com/v1/me/top/artists',
      headers: { Authorization: `Bearer ${req.query.token}` }
    });
    
    const databaseUserObject = translateSpotifyUserObject(spotifyUser);

    user = await findOneUserAndUpdate({
      spotifyUri: databaseUserObject.spotifyUri,
    }, {
      $set: databaseUserObject,
    }, {
      returnNewDocument: true,
      upsert: true,
    });
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
        topArtists: userTopArtists,
        topTracks: userTopTracks.map(({ _id }) => _id),
      },
    }, {
      returnNewDocument: true,
    });
    if (!user || !user.spotifyUri) {
      res.status(404).send('User Not Found').end();
    } else {
      await redisClientDo('set', `${user.spotifyUri}`, JSON.stringify(user));
      res.status(200).send(user).end();
    }
  } catch (error: any) {
    console.error('Error Logging in user: ', error.message);
    res.status(500).send(error.message).end();
  }
  return;
};