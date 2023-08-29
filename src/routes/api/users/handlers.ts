import axios from '../../../plugins/axios';

import { redisClientDo } from '../../../plugins/redis';

/**
 * @function addToUserQueue
 * @param req 
 * @member body.trackUri - uri of track to add to the queue
 * @member query.token - Spotify auth token for the request
 * @returns Promise<void>
 */
export const addToUserQueue = async (req: any, res: any): Promise<void> => {
  try {
    await axios({
      method: 'post',
      url: `https://api.spotify.com/v1/me/player/queue?uri=${req.body.trackUri}`,
      headers: { Authorization: `Bearer ${req.query.token}` }
    });
    res.sendStatus(200).end();
  } catch (error: any) {
    console.error('Error adding to user queue: ', error.response?.statusText || error.message)
    res.status(error.response?.status || 500).send(error.response?.statusText || error.message).end();
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
 * @returns Promise<void>
 */
export const createUserPlaylist = async (req: any, res: any): Promise<void> => {
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
  } catch (error: any) {
    console.error('Error saving new playlist: ', error.response?.statusText || error.message);
    res.status(error.response?.status || 500).send(error.response?.statusText || error.message).end();
  }
  return;
}

/**
 * @function getCurrentTrackBreakdown
 * @param req 
 * @member query.token - Spotify auth token for the request
 * @returns Promise<void>
 */
export const getCurrentTrackBreakdown = async (req: any, res: any): Promise<void> => {
  try {
    const { data: spotifyUserPlaybackState} = await axios({
      method: 'get',
      url: `https://api.spotify.com/v1/me/player/currently-playing`,
      headers: { Authorization: `Bearer ${req.query.token}` },
    });
    if (!spotifyUserPlaybackState) {
      res.status(404).send('No Playback State Found').end();
    } else {
      res.status(200).send(spotifyUserPlaybackState).end();
    }
  } catch (error: any) {
    console.error('Error retrieving user playback state: ', error.response?.statusText || error.message);
    res.status(error.response?.status || 500).send(error.response?.statusText || error.message).end();
  }
  return;
}
export const getUserTopArtists = async (req: any, res: any) => {
  try {
    const { data: spotifyUserTopArtists } = await axios({
      method: 'get',
      url: 'https://api.spotify.com/v1/me/top/artists',
      headers: { Authorization: `Bearer ${req.query.token}` }
    });
    res.status(200).send(spotifyUserTopArtists.items).end();
  } catch (error: any) {
    console.error('Error getting user top artists: ', error.response?.statusText || error.message);
    res.status(error.response?.status || 500).send(error.response?.statusText || error.message).end();
  }
  return;
}
export const getUserTopTracks = async (req: any, res: any) => {
  try {
    const { data: spotifyUserTopTracks } = await axios({
      method: 'get',
      url: 'https://api.spotify.com/v1/me/top/tracks',
      headers: { Authorization: `Bearer ${req.query.token}` }
    });
    res.status(200).send(spotifyUserTopTracks.items).end();
  } catch (error: any) {
    console.error('Error getting user top tracks: ', error.response?.statusText || error.message);
    res.status(error.response?.status || 500).send(error.response?.statusText || error.message).end();
  }
  return;
}
export const getUserPlaylists = async (req: any, res: any) => {
  try {
    const { data: spotifyUserPlaylists } = await axios({
      method: 'get',
      url: `https://api.spotify.com/v1/me/playlists?limit=50`,
      headers: { Authorization: `Bearer ${req.query.token}` },
    });
    const filteredPlaylists = spotifyUserPlaylists.items.filter((playlist: any) => playlist.owner.uri.endsWith(req.params.id));
    res.status(200).send(filteredPlaylists).end();
  } catch (error: any) {
    console.error('Error retrieving playlists: ', error.response?.statusText || error.message);
    res.status(error.response?.status || 500).send(error.response?.statusText || error.message).end();
  }
  return;
}

/**
 * @function loginUser
 * @param req 
 * @member query.token - Spotify auth token to use for the request
 * @returns spotify user object
 */
export const loginUser = async (req: any, res: any) => {
  try {
    const { data: spotifyUser } = await axios({
      method: 'get',
      url: 'https://api.spotify.com/v1/me',
      headers: { Authorization: `Bearer ${req.query.token}` }
    });
    res.status(200).send(spotifyUser).end();
  } catch (error: any) {
    console.error('Error Logging in user: ', error.response?.statusText || error.message);
    res.status(error.response?.status || 500).send(error.response?.statusText || error.message).end();
  }
  return;
};