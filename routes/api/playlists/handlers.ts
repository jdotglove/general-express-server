import axios from '../../../plugins/axios';
import mongoose from '../../../plugins/mongoose';
import getOnePlaylist from '../../../plugins/graphql/query/getOnePlaylist';
import { parseUriForId } from '../../../utils/spotify';
import { Playlist } from '../../../db/services/playlist';
import { graphQLRequest } from '../../../plugins/graphql';
import { translateGQLDocument } from '../../../utils/graphql';
import { redisClientDo } from '../../../plugins/redis';

export const getPlaylistTracks = async (req: any, res: any) => {
  try { 
    const { data: { data }} = await graphQLRequest({
      query: getOnePlaylist,
      variables: {
        playlistId: req.params.id,
      },
    });
    let playlist = translateGQLDocument(data.getOnePlaylist) as Playlist;
    console.log('Found Playlist: ', playlist);
    const userSpotifyId = parseUriForId(playlist.ownerUri);
    const cachedSpotifyToken = await redisClientDo('get', `audionest:${userSpotifyId}:token`);
    // await redisClientDo('get', )
    console.log('Cached Token: ', cachedSpotifyToken);
    if (cachedSpotifyToken) {
      const playlistSpotifyId = parseUriForId(playlist.spotifyUri);
      const { data: spotifyPlaylistTracks } = await axios({
        method: 'get',
        url: `https://api.spotify.com/v1/playlists/${playlistSpotifyId}/tracks`,
        headers: { Authorization: `Bearer ${cachedSpotifyToken}` },
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
    // if (!playlists || playlists.length === 0) {
    //   res.status(404).send('Playlists Not Found').end();
    //   return;
    // } else {
    //   res.status(200).send(playlists).end();
    // }
  } catch (error: any) {
    console.error('Error retrieving tracks: ', error.message);
    res.status(500).send(error.message).end();
  }

  res.status(200).send().end();
  return;
}