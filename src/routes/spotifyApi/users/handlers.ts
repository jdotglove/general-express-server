import { Request, Response } from '../../../plugins/express';
import axios from '../../../plugins/axios';
import { SERVER_RESPONSE_CODES } from 'utils/constants';

/**
 * @function addToUserQueue
 * @param req 
 * @member body.trackUri - uri of track to add to the queue
 * @member query.token - Spotify auth token for the request
 * @returns - Nothing
 */
export const addToUserQueue = async (req: Request, res: Response): Promise<void> => {
  try {
    await axios({
      method: 'post',
      url: `https://api.spotify.com/v1/me/player/queue?uri=${req.body.trackUri}`,
      headers: { Authorization: `Bearer ${req.query.token}` },
    });
    res.sendStatus(SERVER_RESPONSE_CODES.ACCEPTED).end();
  } catch (error: any) {
    const errorObj = error.response ? {
      status: error.response.status,
      message: error.response.statusText || error.message,
    } : {
      status: SERVER_RESPONSE_CODES.SERVER_ERROR,
      message: error.message
    };
    console.error('Error adding to user queue: ', errorObj.message);
    res.status(errorObj.status).send({ error: errorObj.message }).end();
  }
  return;
}

/**
 * @function createUserPlaylist
 * @param req 
 * @member query.token - Spotify auth token for the request
 * @member params.id - Id of user to create the playlist for
 * @member body.playlistName - name of the new playlist
 * @member body.playlistDescription - description of the new playlist
 * @member body.publicPlaylist - boolean for if playlist is public or not
 * @member body.tracks - tracks to add to the newly created playlist
 * @returns - boolean signifying playlist was created
 */
export const createUserPlaylist = async (req: Request, res: Response): Promise<void> => {
  try {
    // Create playlist first
    const { data: spotifyCreatePlaylist } = await axios({
      method: 'post',
      url: `https://api.spotify.com/v1/users/${req.params.id}/playlists`,
      headers: { Authorization: `Bearer ${req.query.token}` },
      data: JSON.stringify({
        name: req.body.playlistName,
        public: req.body.publicPlaylist,
        description: req.body.playlistDescription,
      }),
    });
    // Then add tracks using the id for the response
    await axios({
      method: 'post',
      url: `https://api.spotify.com/v1/playlists/${spotifyCreatePlaylist.id}/tracks`,
      headers: { Authorization: `Bearer ${req.query.token}` },
      data: JSON.stringify({
        uris: req.body.tracks,
      }),
    });
    res.status(SERVER_RESPONSE_CODES.CREATED).send({ created: true }).end();
  } catch (error: any) {
    const errorObj = error.response ? {
      status: error.response.status,
      message: error.response.statusText || error.message,
    } : {
      status: SERVER_RESPONSE_CODES.SERVER_ERROR,
      message: error.message
    };
    console.error('Error saving new playlist: ', errorObj.message);
    res.status(errorObj.status).send({ error: errorObj.message }).end();
  }
  return;
}

/**
 * @function getCurrentTrackBreakdown
 * @param req 
 * @member query.token - Spotify auth token for the request
 * @returns - The break down of the track currently playing for the logged in user
 */
export const getCurrentTrackBreakdown = async (req: Request, res: Response): Promise<void> => {
  try {
    const { data: spotifyUserPlaybackState } = await axios({
      method: 'get',
      url: `https://api.spotify.com/v1/me/player/currently-playing`,
      headers: { Authorization: `Bearer ${req.query.token}` },
    });
    if (!spotifyUserPlaybackState) {
      res.status(SERVER_RESPONSE_CODES.NOT_FOUND).send('No Playback State Found').end();
    } else {
      res.status(SERVER_RESPONSE_CODES.ACCEPTED).send(spotifyUserPlaybackState).end();
    }
  } catch (error: any) {
    const errorObj = error.response ? {
      status: error.response.status,
      message: error.response.statusText || error.message,
    } : {
      status: SERVER_RESPONSE_CODES.SERVER_ERROR,
      message: error.message
    };
    console.error('Error retrieving user playback state: ', errorObj.message);
    res.status(errorObj.status).send({ error: errorObj.message }).end();
  }
  return;
}
/**
 * @function getCurrentUserTopArtists
 * @param req 
 * @member query.token - Spotify auth token for the request
 * @returns - The current logged in users top artists
 */
export const getCurrentUserTopArtists = async (req: Request, res: Response) => {
  try {
    const { data: spotifyUserTopArtists } = await axios({
      method: 'get',
      url: 'https://api.spotify.com/v1/me/top/artists',
      headers: { Authorization: `Bearer ${req.query.token}` },
    });
    res.status(SERVER_RESPONSE_CODES.ACCEPTED).send(spotifyUserTopArtists.items).end();
  } catch (error: any) {
    const errorObj = error.response ? {
      status: error.response.status,
      message: error.response.statusText || error.message,
    } : {
      status: SERVER_RESPONSE_CODES.SERVER_ERROR,
      message: error.message
    };
    console.error('Error getting user top artists: ', errorObj.message);
    res.status(errorObj.status).send({ error: errorObj.message }).end();
  }
  return;
}
/**
 * @function getCurrentUserTopTracks
 * @param req 
 * @member query.token - Spotify auth token for the request
 * @returns - The current logged in users top tracks
 */
export const getCurrentUserTopTracks = async (req: Request, res: Response) => {
  try {
    const { data: spotifyUserTopTracks } = await axios({
      method: 'get',
      url: 'https://api.spotify.com/v1/me/top/tracks',
      headers: { Authorization: `Bearer ${req.query.token}` },
    });
    res.status(SERVER_RESPONSE_CODES.ACCEPTED).send(spotifyUserTopTracks.items).end();
  } catch (error: any) {
    const errorObj = error.response ? {
      status: error.response.status,
      message: error.response.statusText || error.message,
    } : {
      status: SERVER_RESPONSE_CODES.SERVER_ERROR,
      message: error.message
    };
    console.error('Error getting user top tracks: ', errorObj.message);
    res.status(errorObj.status).send({ error: errorObj.message }).end();
  }
  return;
}
/**
 * @function getCurrentUserPlaylists
 * @param req 
 * @member query.token - Spotify auth token for the request
 * @member params.id - Id of user to get playlists for
 * @returns - The current users playlists
 */
export const getCurrentUserPlaylists = async (req: Request, res: Response) => {
  try {
    const { data: spotifyUserPlaylists } = await axios({
      method: 'get',
      url: `https://api.spotify.com/v1/me/playlists?limit=50`,
      headers: { Authorization: `Bearer ${req.query.token}` },
    });
    const filteredPlaylists = spotifyUserPlaylists.items.filter((playlist: any) => playlist.owner.uri.endsWith(req.params.id));
    res.status(SERVER_RESPONSE_CODES.ACCEPTED).send(filteredPlaylists).end();
  } catch (error: any) {
    const errorObj = error.response ? {
      status: error.response.status,
      message: error.response.statusText || error.message,
    } : {
      status: SERVER_RESPONSE_CODES.SERVER_ERROR,
      message: error.message
    };
    console.error('Error retrieving playlists: ', errorObj.message);
    res.status(errorObj.status).send({ error: errorObj.message }).end();
  }
  return;
}

/**
 * @function loginUser
 * @param req 
 * @member query.token - Spotify auth token to use for the request
 * @returns - Spotify user object
 */
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { data: spotifyUser } = await axios({
      method: 'get',
      url: 'https://api.spotify.com/v1/me',
      headers: { Authorization: `Bearer ${req.query.token}` },
    });
    res.status(SERVER_RESPONSE_CODES.ACCEPTED).send(spotifyUser).end();
  } catch (error: any) {
    const errorObj = error.response ? {
      status: error.response.status,
      message: error.response.statusText || error.message,
    } : {
      status: SERVER_RESPONSE_CODES.SERVER_ERROR,
      message: error.message
    };
    console.error('Error Logging in user: ', errorObj.message);
    res.status(errorObj.status).send({ error: errorObj.message }).end();
  }
  return;
};