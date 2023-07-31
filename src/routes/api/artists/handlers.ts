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
    if (process.env.NODE_ENV === 'development') {
      console.log('GetArtist Running GraphQL Query');
      const { data: { data } } = await graphQLRequest({
        query: getOneArtist,
        variables: {
          artistId: req.params.id,
        },
      });
      artist = data?.getOneArtist as Artist;
    } else {
      artist = await findOneArtist({ _id: req.params.id });
    }

    if (!artist) {
      res.status(404).send('Tracks Not Found').end();
      return;
    } else {
      res.status(200).send(artist).end();
    }

  } catch (error: any) {
    console.error('Error retrieving playlist tracks: ', error.message);
    res.status(500).send(error.message).end();
  }
  return;
}