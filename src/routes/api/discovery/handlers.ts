import axios from '../../../plugins/axios';

export const getNewReleases = async (req: any, res: any) => {
  try {
    const offSet = req.query.page === 1 ? 0 : req.query.page * 8
    // console.log('Page: ', req.query.page, 'Offset: ', offSet)
    const { data: spotifyNewReleases } = await axios({
      method: 'get',
      url: `https://api.spotify.com/v1/browse/new-releases?limit=8&offset=${offSet}`,
      headers: { Authorization: `Bearer ${req.query.token}` },
    });
    res.status(200).send(spotifyNewReleases.albums.items).end();
  } catch (error: any) {
    console.error('Error getting new releases: ', error.response?.statusText || error.message);
    res.status(error.response?.status || 500).send(error.response?.statusText || error.message).end();
  }
  return;
}