import axios from '../../../plugins/axios';
import mongoose from '../../../plugins/mongoose';
import getOneArtist from '../../../plugins/graphql/query/getOneArtist';
import { parseUriForId, resolveTracksInDatabase } from '../../../utils/spotify';
import { Artist, findOneArtist } from '../../../db/services/artist';
import { graphQLRequest } from '../../../plugins/graphql';
import { redisClientDo } from '../../../plugins/redis';

export const getArtist = async (req: any, res: any) => {
  let artist;
  try {
    const { data: spotifyGetArtist } = await axios({
      method: 'get',
      url: `https://api.spotify.com/v1/artists/${req.params.id}`,
      headers: { Authorization: `Bearer ${req.query.token}` },
    });
    res.status(200).send(spotifyGetArtist);

  } catch (error: any) {
    console.error('Error retrieving artist: ', error.message);
    res.status(500).send(error.message).end();
  }
  return;
}

export const searchForArtist = async (req: any, res: any) => {
  try {
    const { data: spotifyArtistSearch } = await axios({
      method: 'get',
      url: `https://api.spotify.com/v1/search?q=${encodeURI(req.body.query)}&type=${req.body.type}&limit=3`,
      headers: { Authorization: `Bearer ${req.query.token}` },
    });
    const possibleArtists = spotifyArtistSearch.artists.items;
    if (!possibleArtists) {
      res.status(404).send('No artists found with this search query').end();
    } else {
      res.status(200).send(possibleArtists).end();
    }
  } catch (error: any) {
    console.error('Error searching for artist', error);
    res.status(500).send(error.message).end();
  }
  return;
}