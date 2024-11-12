import { SERVER_RESPONSE_CODES } from 'utils/constants';
import axios from '../../../plugins/axios';
import { Request, Response } from '../../../plugins/express';

/**
 * @function getAlbum
 * @param req 
 * @member params.id - ID of album to find
 * @member query.token - Spotify auth token for the request
 * @returns album object
 */
 export const getAlbum = async (req: Request, res: Response) => {
  try {
    const { data: spotifyAlbum } = await axios({
      method: 'get',
      url: `https://api.spotify.com/v1/albums/${req.params.id}`,
      headers: { Authorization: `Bearer ${req.query.token}` },
    });
    res.status(SERVER_RESPONSE_CODES.ACCEPTED).send(spotifyAlbum).end();
  } catch (error: any) {
    const errorObj = error.response ? {
      status: error.response.status,
      message: error.response.statusText || error.message,
    } : {
      status: SERVER_RESPONSE_CODES.SERVER_ERROR,
      message: error.message
    };
    console.error('Error retrieving album: ', errorObj.message);
    res.status(errorObj.status).send({ error: errorObj.message }).end();
  }
  return;
}

/**
 * @function getAlbumTracks
 * @param req 
 * @member params.id - ID of album to find the tracks for
 * @member query.token - Spotify auth token for the request
 * @returns array of track objects
 */
export const getAlbumTracks = async (req: Request, res: Response) => {
  try {
    const { data: spotifyAlbumTracks } = await axios({
      method: 'get',
      url: `https://api.spotify.com/v1/albums/${req.params.id}/tracks`,
      headers: { Authorization: `Bearer ${req.query.token}` },
    });
    const trackObjArray = spotifyAlbumTracks.items.map((albumTrack: any) => (albumTrack.track))
    res.status(SERVER_RESPONSE_CODES.ACCEPTED).send(trackObjArray).end();
  } catch (error: any) {
    const errorObj = error.response ? {
      status: error.response.status,
      message: error.response.statusText || error.message,
    } : {
      status: SERVER_RESPONSE_CODES.SERVER_ERROR,
      message: error.message
    };
    console.error('Error retrieving playlist tracks: ', errorObj.message);
    res.status(errorObj.status).send({ error: errorObj.message }).end();
  }
  return;
}