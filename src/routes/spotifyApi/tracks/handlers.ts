import { SERVER_RESPONSE_CODES } from '../../../utils/errors';
import axios from '../../../plugins/axios';
import { Request, Response } from '../../../plugins/express';

/**
 * @function getTrack
 * @param req
 * @member query.token - spotify auth token for request
 * @member params.id - track to be retrieved
 * @returns selected track object
 */
export const getTrack = async (req: Request, res: Response) => {
  try {
    const { data: spotifyGetTrack } = await axios({
      method: 'get',
      url: `https://api.spotify.com/v1/tracks/${req.params.id}`,
      headers: { Authorization: `Bearer ${req.query.token}` },
    });
    res.status(SERVER_RESPONSE_CODES.ACCEPTED).send(spotifyGetTrack).end();
  } catch (error: any) {
    const errorObj = error.response ? {
      status: error.response.status,
      message: error.response.statusText || error.message,
    } : {
      status: SERVER_RESPONSE_CODES.SERVER_ERROR,
      message: error.message
    };
    console.error('Error retrieving track: ', errorObj.message);
    res.status(errorObj.status).send({ error: errorObj.message }).end();
  }
  return;
}

/**
 * @function batchIds
 * @param idArray array to be batched
 * @returns Id array batched into groups of 50
 */
const batchIds = (idArray: Array<string>) => {
  let startIdx = 0;
  const batchLimit = 50;
  const batchedIdArray = [];
  while (startIdx <= idArray.length) {
    batchedIdArray.push(idArray.slice(startIdx, startIdx + batchLimit));
    startIdx += batchLimit;
  }
  return batchedIdArray;
}

/**
 * @function getSelectedTracks
 * @param req 
 * @member query.ids - Selected IDs of tracks to retrieve
 * @member query.token - Spotify auth token for request
 * @returns array of track objects
 */
export const getSelectedTracks = async (req: Request, res: Response) => {
  try {
    const idBatches = batchIds(req.query.ids as Array<string>)
    let tracksArray: Array<string | Array<string>> = []
    await Promise.all(idBatches.map(async (batchOfIds) => {
      const { data: spotifyGetTracks } = await axios({
        method: 'get',
        url: `https://api.spotify.com/v1/tracks?ids=${batchOfIds}`,
        headers: { Authorization: `Bearer ${req.query.token}` },
      });
      tracksArray.push(spotifyGetTracks.tracks);
    }));
    res.status(SERVER_RESPONSE_CODES.ACCEPTED).send(tracksArray.flat()).end();
  } catch (error: any) {
    const errorObj = error.response ? {
      status: error.response.status,
      message: error.response.statusText || error.message,
    } : {
      status: SERVER_RESPONSE_CODES.SERVER_ERROR,
      message: error.message
    };
    console.error('Error getting selected track: ', errorObj.message);
    res.status(errorObj.status).send({ error: errorObj.message }).end();
  }
  return;
}

/**
 * 
 * @param req
 * @member params.id - ID of track to get audio features for
 * @member query.token - Spotify auth token for request
 * @returns track features object for the track
 */
export const getTrackAudioFeatures = async (req: Request, res: Response) => {
  try {
    const { data: spotifyTracksAudioFeatures } = await axios({
      method: 'get',
      url: `https://api.spotify.com/v1/audio-features/${req.params.id}`,
      headers: { Authorization: `Bearer ${req.query.token}` },
    });
    res.status(SERVER_RESPONSE_CODES.ACCEPTED).send(spotifyTracksAudioFeatures).end();
  } catch (error: any) {
    const errorObj = error.response ? {
      status: error.response.status,
      message: error.response.statusText || error.message,
    } : {
      status: SERVER_RESPONSE_CODES.SERVER_ERROR,
      message: error.message
    };
    console.error('Error retrieving audio features for track: ', errorObj.message);
    res.status(errorObj.status).send({ error: errorObj.message }).end();
  }
  return;
}

/**
 * @function searchForTrack
 * @param req 
 * @member body.query - track query to use for search
 * @member body.type - type of item the search is for
 * @returns possible found items that match the search query
 */
export const searchForTrack = async (req: Request, res: Response) => {
  try {
    const { data: spotifyTrackSearch } = await axios({
      method: 'get',
      url: `https://api.spotify.com/v1/search?q=${encodeURI(req.body.query)}&type=${req.body.type}`,
      headers: { Authorization: `Bearer ${req.query.token}` },
    });
    const possibleTracks = spotifyTrackSearch.tracks.items;
    if (!possibleTracks) {
      res.status(SERVER_RESPONSE_CODES.NOT_FOUND).send('No tracks found with this search query').end();
    } else {
      res.status(SERVER_RESPONSE_CODES.ACCEPTED).send(possibleTracks).end();
    }
  } catch (error: any) {
    const errorObj = error.response ? {
      status: error.response.status,
      message: error.response.statusText || error.message,
    } : {
      status: SERVER_RESPONSE_CODES.SERVER_ERROR,
      message: error.message
    };
    console.error('Error searching for track', errorObj.message);
    res.status(errorObj.status).send({ error: errorObj.message }).end();
  }
  return;
}