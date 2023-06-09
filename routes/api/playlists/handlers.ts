import axios from '../../../plugins/axios';
import mongoose from '../../../plugins/mongoose';
import getOnePlaylist from '../../../plugins/graphql/query/getOnePlaylist';
import { parseUriForId, resolveTracksInDatabase } from '../../../utils/spotify';
import { Playlist } from '../../../db/services/playlist';
import { graphQLRequest } from '../../../plugins/graphql';
import { translateGQLDocument } from '../../../utils/graphql';
import { redisClientDo } from '../../../plugins/redis';

export const getPlaylistTracks = async (req: any, res: any) => {
  try {
    const { data: { data } } = await graphQLRequest({
      query: getOnePlaylist,
      variables: {
        playlistId: req.params.id,
      },
    });
    let playlist = data?.getOnePlaylist as Playlist;
    // await redisClientDo('get', )
    const playlistSpotifyId = parseUriForId(playlist.spotifyUri);
    const { data: spotifyPlaylistTracks } = await axios({
      method: 'get',
      url: `https://api.spotify.com/v1/playlists/${playlistSpotifyId}/tracks`,
      headers: { Authorization: `Bearer ${req.query.token}` },
    });
    const tracks = await resolveTracksInDatabase(spotifyPlaylistTracks.items);
    if (!tracks || tracks.length === 0) {
      res.status(404).send('Tracks Not Found').end();
      return;
    } else {
      res.status(200).send(tracks).end();
    }

  } catch (error: any) {
    console.error('Error retrieving playlist tracks: ', error.message);
    res.status(500).send(error.message).end();
  }

  res.status(200).send().end();
  return;
}