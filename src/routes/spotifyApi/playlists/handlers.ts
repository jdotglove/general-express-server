import axios from '../../../plugins/axios';

/**
 * @function getPlaylist
 * @param req 
 * @member params.id - ID of playlist to find
 * @member query.token - Spotify auth token for the request
 * @returns playlist object
 */
 export const getPlaylist = async (req: any, res: any) => {
  try {
    const { data: spotifyPlaylist } = await axios({
      method: 'get',
      url: `https://api.spotify.com/v1/playlists/${req.params.id}`,
      headers: { Authorization: `Bearer ${req.query.token}` },
    });
    res.status(200).send(spotifyPlaylist).end();
  } catch (error: any) {
    console.error('Error retrieving playlist: ', error.response?.statusText || error.message);
    res.status(error.response?.status || 500).send(error.response?.statusText || error.message).end();
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
export const getPlaylistTracks = async (req: any, res: any) => {
  try {
    const { data: spotifyPlaylistTracks } = await axios({
      method: 'get',
      url: `https://api.spotify.com/v1/playlists/${req.params.id}/tracks`,
      headers: { Authorization: `Bearer ${req.query.token}` },
    });
    const trackObjArray = spotifyPlaylistTracks.items.map((playlistTrack: any) => (playlistTrack.track))
    res.status(200).send(trackObjArray).end();
  } catch (error: any) {
    console.error('Error retrieving playlist tracks: ', error.response?.statusText || error.message);
    res.status(error.response?.status || 500).send(error.response?.statusText || error.message).end();
  }
  return;
}