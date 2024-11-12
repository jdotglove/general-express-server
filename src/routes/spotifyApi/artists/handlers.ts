import { SERVER_RESPONSE_CODES } from 'utils/constants';
import axios from '../../../plugins/axios';
import { Request, Response } from '../../../plugins/express';

/**
 * @function getArtist
 * @param req
 * @member query.token - Spotify auth token for request
 * @member params.id - ID of artist to be retrieved
 * @returns selected artist object
 */
export const getArtist = async (req: Request, res: Response) => {
  try {
    const { data: spotifyGetArtist } = await axios({
      method: 'get',
      url: `https://api.spotify.com/v1/artists/${req.params.id}`,
      headers: { Authorization: `Bearer ${req.query.token}` },
    });
    res.status(SERVER_RESPONSE_CODES.ACCEPTED).send(spotifyGetArtist).end();
  } catch (error: any) {
    const errorObj = error.response ? {
      status: error.response.status,
      message: error.response.statusText || error.message,
    } : {
      status: SERVER_RESPONSE_CODES.SERVER_ERROR,
      message: error.message
    };
    console.error('Error retrieving artist: ', errorObj.message);
    res.status(errorObj.status).send({ error: errorObj.message }).end();
  }
  return;
}

/**
 * @function searchForArtist
 * @param req
 * @member body.query - artist search query
 * @member query.token - spotify auth token for request
 * @member params.id - artist to be retrieved
 * @returns selected artist object
 */
export const searchForArtist = async (req: Request, res: Response) => {
  try {
    const { data: spotifyArtistSearch } = await axios({
      method: 'get',
      url: `https://api.spotify.com/v1/search?q=${encodeURI(req.body.query)}&type=${req.body.type}`,
      headers: { Authorization: `Bearer ${req.query.token}` },
    });
    const possibleArtists = spotifyArtistSearch.artists.items;
    if (!possibleArtists) {
      res.status(SERVER_RESPONSE_CODES.NOT_FOUND).send('No artists found with this search query').end();
    } else {
      res.status(SERVER_RESPONSE_CODES.ACCEPTED).send(possibleArtists).end();
    }
  } catch (error: any) {
    const errorObj = error.response ? {
      status: error.response.status,
      message: error.response.statusText || error.message,
    } : {
      status: SERVER_RESPONSE_CODES.SERVER_ERROR,
      message: error.message
    };
    console.error('Error searching for artist', errorObj.message);
    res.status(errorObj.status).send({ error: errorObj.message }).end();
  }
  return;
}