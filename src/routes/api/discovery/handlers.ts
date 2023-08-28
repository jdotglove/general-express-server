import axios from '../../../plugins/axios';

/**
 * @function getCategoryPlaylists
 * @param req 
 * @member query.page - page of data to request (used with limit)
 * @member query.token - Spotify auth token to use for the request
 * @member params.category - browsing category to fetch the playlists for
 * @returns array of category featured playlists
 */
export const getCategoryPlaylists = async (req: any, res: any) => {
  try {
    const limit = 16;
    const offset = req.query.page === 1 ? 0 : req.query.page * limit;
    const { data: spotifyCategoryPlaylists } = await axios({
      method: 'get',
      url: `https://api.spotify.com/v1/browse/categories/${req.params.category}/playlists?limit=${limit}&offset=${offset}`,
      headers: { Authorization: `Bearer ${req.query.token}` }
    });
    res.status(200).send(spotifyCategoryPlaylists.playlists.items).end();
  } catch (error: any) {
    console.error('Error getting category playlists: ', error.response?.statusText || error.message);
    res.status(error.response?.status || 500).send(error.response?.statusText || error.message).end();
  }
  return;
}

/**
 * @function getNewReleases
 * @param req 
 * @member query.page - page of data to request (used with limit)
 * @member query.token - Spotify auth token to use for the request
 * @returns array of new releases
 */
export const getNewReleases = async (req: any, res: any) => {
  try {
    const limit = 16
    const offset = req.query.page === 1 ? 0 : req.query.page * limit
    const { data: spotifyNewReleases } = await axios({
      method: 'get',
      url: `https://api.spotify.com/v1/browse/new-releases?limit=${limit}&offset=${offset}`,
      headers: { Authorization: `Bearer ${req.query.token}` },
    });
    res.status(200).send(spotifyNewReleases.albums.items).end();
  } catch (error: any) {
    console.error('Error getting new releases: ', error.response?.statusText || error.message);
    res.status(error.response?.status || 500).send(error.response?.statusText || error.message).end();
  }
  return;
}

/**
 * @function getBrowsingCategories
 * @param req 
 * @member query.token - Spotify auth token to use for the request
 * @returns array of all browsing categories
 */
export const getBrowsingCategories = async (req: any, res: any) => {
  try {
    const limit = 20;
    const categoryArray: Array<any> = [];
    let getMoreCategories = true;
    let offset = 0;
    // Pull all categories in the loop to account for more categories than the max limit
    while (getMoreCategories) {
      const { data: spotifyCategories }: { data: { categories: { items: Array<any> } } } = await axios({
        method: 'get',
        url: `https://api.spotify.com/v1/browse/categories?limit=${limit}&offset=${offset}`,
        headers: { Authorization: `Bearer ${req.query.token}` },
      });
      categoryArray.push(spotifyCategories.categories.items);
      if (spotifyCategories.categories.items.length < limit) {
        getMoreCategories = false;
      }
      offset += limit;
    }

    res.status(200).send(categoryArray.flat()).end();
  } catch (error: any) {
    console.error('Error getting browsing categories: ', error.response?.status || error.message);
    res.status(error.response?.status || 500).send(error.response?.statusText || error.message).end();
  }
  return;
}