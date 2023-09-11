import axios from '../../../plugins/axios';

/**
 * @function getAlbum
 * @param req 
 * @member params.id - ID of album to find
 * @member query.token - Spotify auth token for the request
 * @returns album object
 */
 export const getAlbum = async (req: any, res: any) => {
  try {
    const { data: spotifyAlbum } = await axios({
      method: 'get',
      url: `https://api.spotify.com/v1/albums/${req.params.id}`,
      headers: { Authorization: `Bearer ${req.query.token}` },
    });
    res.status(200).send(spotifyAlbum).end();
  } catch (error: any) {
    console.error('Error retrieving album: ', error.response?.statusText || error.message);
    res.status(error.response?.status || 500).send(error.response?.statusText || error.message).end();
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
export const getAlbumTracks = async (req: any, res: any) => {
  try {
    const { data: spotifyAlbumTracks } = await axios({
      method: 'get',
      url: `https://api.spotify.com/v1/albums/${req.params.id}/tracks`,
      headers: { Authorization: `Bearer ${req.query.token}` },
    });
    const trackObjArray = spotifyAlbumTracks.items.map((albumTrack: any) => (albumTrack.track))
    res.status(200).send(trackObjArray).end();
  } catch (error: any) {
    console.error('Error retrieving playlist tracks: ', error.response?.statusText || error.message);
    res.status(error.response?.status || 500).send(error.response?.statusText || error.message).end();
  }
  return;
}