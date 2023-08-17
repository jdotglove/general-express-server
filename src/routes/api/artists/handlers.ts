import axios from '../../../plugins/axios';


export const getArtist = async (req: any, res: any) => {
  let artist;
  try {
    const { data: spotifyGetArtist } = await axios({
      method: 'get',
      url: `https://api.spotify.com/v1/artists/${req.params.id}`,
      headers: { Authorization: `Bearer ${req.query.token}` },
    });
    res.status(200).send(spotifyGetArtist);

  } catch (error: any) {
    console.error('Error retrieving artist: ', error.response.statusText);
    res.status(error.response.status).send(error.response.statusText).end();
  }
  return;
}

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
    console.error('Error searching for artist', error.response.statusText);
    res.status(error.response.status).send(error.response.statusText).end();
  }
  return;
}