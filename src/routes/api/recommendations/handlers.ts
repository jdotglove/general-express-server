import axios from '../../../plugins/axios';
import { formatSpotifyRecommendationRequest } from '../../../utils/spotify';


export const generateRecommendations = async (req: any, res: any) => {
  try {
    const recPayload = req.body;
    recPayload.seed_artists = (await Promise.all(req.body.seed_artists.map(async (artistDBId: string) => {
      return artistDBId;
    })) || [])?.join(',');
    recPayload.seed_genres = (req.body.seed_genres)?.join(',');
    recPayload.seed_tracks = (await Promise.all(req.body.seed_tracks.map(async (trackDBId: string) => {
      return trackDBId;
    })) || [])?.join(',');
    const { data: spotifyRecommendedTracks } = await axios({
      method: 'get',
      url: `https://api.spotify.com/v1/recommendations?${formatSpotifyRecommendationRequest(recPayload).replaceAll('"', '')}`,
      headers: { Authorization: `Bearer ${req.query.token}` },
    });

    const tracks = spotifyRecommendedTracks.tracks;
    if (!tracks) {
      res.status(404).send('No Recommended Tracks Found').end();
    } else {
      res.status(200).send(tracks).end();
    }
  } catch (error: any) {
    console.error('Error retrieving recommendation: ', error.response?.statusText || error.message);
    res.status(error.response?.status || 500).send(error.response?.statusText || error.message).end();
  }
  return;
}

export const getSeedGenres = async (req: any, res: any) => {
  try {
    const { data: spotifyAvailableGenreSeeds } = await axios({
      method: 'get',
      url: 'https://api.spotify.com/v1/recommendations/available-genre-seeds',
      headers: { Authorization: `Bearer ${req.query.token}` },
    });
    const genres = spotifyAvailableGenreSeeds.genres;
    if (!genres) {
      res.status(404).send('No Seed Genres Available').end()
    } else {
      res.status(200).send(genres).end();
    }
  } catch (error: any) {
    console.error('Error retrieving available recommendation seed genres: ', error.response?.statusText || error.message);
    res.status(error.response?.status || 500).send(error.response?.statusText || error.message).end();
  }
 return;
}