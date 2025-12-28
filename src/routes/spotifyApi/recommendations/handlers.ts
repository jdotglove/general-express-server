import axios from '../../../plugins/axios';
import { formatSpotifyRecommendationRequest } from '../../../utils/spotify';
import { Request, Response } from '../../../plugins/express';
import { SERVER_RESPONSE_CODES } from '../../../utils/errors';

/**
 * @function generateRecommendations
 * @param req 
 * @member body.seed_artists - artist ids used to seed recommendation
 * @member body.seed_generes - genres used to seed recommendation
 * @member body.seed_tracks - track ids used to seed recommendation
 * @member body (remaining fields) - used to specify audio feature parameters for the recommendation
 * @returns list of spotify tracks that fall into the recommendation pool (limit passed in on payload)
 */
export const generateRecommendations = async (req: Request, res: Response) => {
  try {
    const recPayload = req.body;
    recPayload.seed_artists = (await Promise.all(req.body.seed_artists.map(async (artistDBId: string) => {
      return artistDBId;
    })) || [])?.join(',');
    recPayload.seed_genres = (req.body.seed_genres)?.join(',');
    recPayload.seed_tracks = (await Promise.all(req.body.seed_tracks.map(async (trackDBId: string) => {
      return trackDBId;
    })) || [])?.join(',');
    const { data: spotifyRecommendedTracks } = await axios({
      method: 'get',
      url: `https://api.spotify.com/v1/recommendations?${formatSpotifyRecommendationRequest(recPayload).replaceAll('"', '')}`,
      headers: { Authorization: `Bearer ${req.query.token}` },
    });

    const tracks = spotifyRecommendedTracks.tracks;
    if (!tracks) {
      res.status(SERVER_RESPONSE_CODES.NOT_FOUND).send('No Recommended Tracks Found').end();
    } else {
      res.status(SERVER_RESPONSE_CODES.ACCEPTED).send(tracks).end();
    }
  } catch (error: any) {
    const errorObj = error.response ? {
      status: error.response.status,
      message: error.response.statusText || error.message,
    } : {
      status: SERVER_RESPONSE_CODES.SERVER_ERROR,
      message: error.message
    };
    console.error('Error retrieving recommendation: ', errorObj.message);
    res.status(errorObj.status).send({ error: errorObj.message }).end();
  }
  return;
}

/**
 * @function getSeedGenres
 * @param req 
 * @member query.token - Spotify auth token for the request
 * @returns array of genres available to be used for recommendation seeds
 */
export const getSeedGenres = async (req: Request, res: Response) => {
  try {
    const { data: spotifyAvailableGenreSeeds } = await axios({
      method: 'get',
      url: 'https://api.spotify.com/v1/recommendations/available-genre-seeds',
      headers: { Authorization: `Bearer ${req.query.token}` },
    });
    const genres = spotifyAvailableGenreSeeds.genres;
    if (!genres) {
      res.status(SERVER_RESPONSE_CODES.NOT_FOUND).send('No Seed Genres Available').end();
    } else {
      res.status(SERVER_RESPONSE_CODES.ACCEPTED).send(genres).end();
    }
  } catch (error: any) {
    const errorObj = error.response ? {
      status: error.response.status,
      message: error.response.statusText || error.message,
    } : {
      status: SERVER_RESPONSE_CODES.SERVER_ERROR,
      message: error.message
    };
    console.error('Error retrieving available recommendation seed genres: ', errorObj.message);
    res.status(errorObj.status).send({ error: errorObj.message }).end();
  }
 return;
}