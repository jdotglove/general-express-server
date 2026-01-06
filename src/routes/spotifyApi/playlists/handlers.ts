import { SERVER_RESPONSE_CODES } from '../../../utils/errors';
import axios from '../../../plugins/axios';
import { Request, Response } from '../../../plugins/express';

/**
 * @function getPlaylist
 * @param req 
 * @member params.id - ID of playlist to find
 * @member query.token - Spotify auth token for the request
 * @returns playlist object
 */
 export const getPlaylist = async (req: Request, res: Response) => {
  try {
    const { data: spotifyPlaylist } = await axios({
      method: 'get',
      url: `https://api.spotify.com/v1/playlists/${req.params.id}`,
      headers: { Authorization: `Bearer ${req.query.token}` },
    });
    res.status(SERVER_RESPONSE_CODES.ACCEPTED).send(spotifyPlaylist).end();
  } catch (error: any) {
    const errorObj = error.response ? {
      status: error.response.status,
      message: error.response.statusText || error.message,
    } : {
      status: SERVER_RESPONSE_CODES.SERVER_ERROR,
      message: error.message
    };
    console.error('Error retrieving playlist: ', errorObj.message);
    res.status(errorObj.status).send({ error: errorObj.message }).end();
  }
  return;
}

/**
 * @function getPlaylistTracks
 * @param req 
 * @member params.id - ID of playlist to find the tracks for
 * @member query.token - Spotify auth token for the request
 * @returns array of track objects
 */
export const getPlaylistTracks = async (req: Request, res: Response) => {
  try {
    const { data: spotifyPlaylistTracks } = await axios({
      method: 'get',
      url: `https://api.spotify.com/v1/playlists/${req.params.id}/tracks`,
      headers: { Authorization: `Bearer ${req.query.token}` },
    });
    const trackObjArray = spotifyPlaylistTracks.items.map((playlistTrack: any) => (playlistTrack.track))
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