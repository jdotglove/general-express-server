import axios from '../../../plugins/axios';

/**
 * @function getArtist
 * @param req
 * @member query.token - Spotify auth token for request
 * @member params.id - ID of artist to be retrieved
 * @returns selected artist object
 */
export const getArtist = async (req: any, res: any) => {
  try {
    const { data: spotifyGetArtist } = await axios({
      method: 'get',
      url: `https://api.spotify.com/v1/artists/${req.params.id}`,
      headers: { Authorization: `Bearer ${req.query.token}` },
    });
    res.status(200).send(spotifyGetArtist).end();
  } catch (error: any) {
    console.error('Error retrieving artist: ', error.response?.statusText || error.message);
    res.status(error.response?.status || 500).send(error.response?.statusText || error.message).end();
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
export const searchForArtist = async (req: any, res: any) => {
  try {
    const { data: spotifyArtistSearch } = await axios({
      method: 'get',
      url: `https://api.spotify.com/v1/search?q=${encodeURI(req.body.query)}&type=${req.body.type}`,
      headers: { Authorization: `Bearer ${req.query.token}` },
    });
    const possibleArtists = spotifyArtistSearch.artists.items;
    if (!possibleArtists) {
      res.status(404).send('No artists found with this search query').end();
    } else {
      res.status(200).send(possibleArtists).end();
    }
  } catch (error: any) {
    console.error('Error searching for artist', error.response?.statusText || error.message);
    res.status(error.response?.status || 500).send(error.response?.statusText || error.message).end();
  }
  return;
}