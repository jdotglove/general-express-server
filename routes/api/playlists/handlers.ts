import axios from '../../../plugins/axios';
import mongoose from '../../../plugins/mongoose';
import {
  findOnePlaylist,
  updateOnePlaylist
} from '../../../db/services/playlist';
import { parseUriForId } from '../../../utils/spotify';
import { redisClientDo } from '../../../plugins/redis';
import { findOneUser } from '../../../db/services/user';

export const getPlaylistTracks = async (req: any, res: any) => {
    const playlist = await findOnePlaylist({
      _id: req.params.id,
    });
    const user = await findOneUser({
      spotifyUri: playlist.ownerUri,
    });
    // await redisClientDo('get', )
    if (req.body.spotifyToken) {
      const playlistSpotifyId = parseUriForId(playlist.spotifyUri);
      const { data: spotifyPlaylistTracks } = await axios({
        method: 'get',
        url: `https://api.spotify.com/v1/playlists/${playlistSpotifyId}/tracks`,
        headers: { Authorization: `Bearer ${req.body.spotifyToken}` },
      });
      spotifyPlaylistTracks.items.map((track: any) => {
        console.log('Track: ', track);
      })
      // playlists = await resolveTracksInDatabase(spotifyPlaylistTracks.items);
      // await updateOnePlaylist({
      //   _id: user._id,
      // }, {
      //   $set: {
      //     playlists: playlists.map(({ _id }) => _id),
      //   },
      // });
    } else {
      // playlists = await Promise.all(user.playlists?.map(async (playlistId) => {
      //   const playlist = await findOnePlaylist({
      //     _id: playlistId,
      //   });
      //   await redisClientDo('set', `${playlist.spotifyUri}`, JSON.stringify(playlist));
      //   return playlist;
      // }));
    }
    
    
    res.status(200).send().end();
    return;
  }