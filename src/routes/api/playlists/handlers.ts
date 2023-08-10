import axios from '../../../plugins/axios';
import mongoose from '../../../plugins/mongoose';
import getOnePlaylist from '../../../plugins/graphql/query/getOnePlaylist';
import { parseUriForId, resolveTracksInDatabase } from '../../../utils/spotify';
import { findOnePlaylist, Playlist } from '../../../db/services/playlist';
import { graphQLRequest } from '../../../plugins/graphql';
import { translateGQLDocument } from '../../../utils/graphql';
import { redisClientDo } from '../../../plugins/redis';

export const getPlaylistTracks = async (req: any, res: any) => {
  let playlist;
  try {
    const { data: spotifyPlaylistTracks } = await axios({
      method: 'get',
      url: `https://api.spotify.com/v1/playlists/${req.params.id}/tracks`,
      headers: { Authorization: `Bearer ${req.query.token}` },
    });
    const trackObjArray = spotifyPlaylistTracks.items.map((playlistTrack: any) => (playlistTrack.track))
    res.status(200).send(trackObjArray).end();

  } catch (error: any) {
    console.error('Error retrieving playlist tracks: ', error.message);
    res.status(500).send(error.message).end();
  }

  return;
}