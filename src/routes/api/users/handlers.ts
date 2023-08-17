import axios from '../../../plugins/axios';

import { redisClientDo } from '../../../plugins/redis';
import { Playlist } from '../../../db/services/playlist';

export const addToUserQueue = async (req: any, res: any) => {
  try {
    await axios({
      method: 'post',
      url: `https://api.spotify.com/v1/me/player/queue?uri=${req.body.trackUri}`,
      headers: { Authorization: `Bearer ${req.query.token}` }
    });
    res.sendStatus(200).end();
  } catch (error: any) {
    console.error('Error adding to user queue: ', error.response.statusText)
    res.status(error.response.status).send(error.response.statusText).end();
  }
  return;
}
export const createUserPlaylist = async (req: any, res: any) => {
  try {
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
    await axios({
      method: 'post',
      url: `https://api.spotify.com/v1/playlists/${spotifyCreatePlaylist.id}/tracks`,
      headers: { Authorization: `Bearer ${req.query.token}` },
      data: JSON.stringify({
        uris: req.body.tracks,
      }),
    });
  } catch (error: any) {
    console.error('Error saving new playlist: ', error.response.statusText);
    res.status(error.response.status).send(error.response.statusText).end();
  }
  return;
}
export const getCurrentTrackBreakdown = async (req: any, res: any) => {
  try {
    console.log('Req');
    const { data: spotifyUserPlaybackState} = await axios({
      method: 'get',
      url: `https://api.spotify.com/v1/me/player/currently-playing`,
      headers: { Authorization: `Bearer ${req.query.token}` },
    });
    console.log('Playback State: ', spotifyUserPlaybackState);
    if (!spotifyUserPlaybackState) {
      res.status(404).send('No Playback State Found').end();
    } else {
      res.status(200).send(spotifyUserPlaybackState).end();
    }
  } catch (error: any) {
    console.log(error.response);
    console.error('Error retrieving user playback state: ', error.response.statusText);
    res.status(error.response.status).send(error.response.statusText).end();
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
    console.error('Error getting user top artists: ', error.response.statusText);
    res.status(error.response.status).send(error.response.statusText).end();
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
    console.error('Error getting user top tracks: ', error.response.statusText);
    res.status(error.response.status).send(error.response.statusText).end();
  }
  return;
}
export const getUserPlaylists = async (req: any, res: any) => {
  let playlists: Playlist[];
  try {
    const { data: spotifyUserPlaylists } = await axios({
      method: 'get',
      url: `https://api.spotify.com/v1/me/playlists?limit=50`,
      headers: { Authorization: `Bearer ${req.query.token}` },
    });
    const filteredPlaylists = spotifyUserPlaylists.items.filter((playlist: any) => playlist.owner.uri.endsWith(req.params.id));
    res.status(200).send(filteredPlaylists).end();
  } catch (error: any) {
    console.error('Error retrieving playlists: ', error.response.statusText);
    res.status(error.response.status).send(error.response.statusText).end();
  }
  return;
}
export const loginUser = async (req: any, res: any) => {
  try {
    const { data: spotifyUser } = await axios({
      method: 'get',
      url: 'https://api.spotify.com/v1/me',
      headers: { Authorization: `Bearer ${req.query.token}` }
    });
    await redisClientDo('set', `${spotifyUser.uri}`, JSON.stringify(spotifyUser));
    res.status(200).send(spotifyUser).end();
  } catch (error: any) {
    console.error('Error Logging in user: ', error.response.statusText);
    res.status(error.response.status).send(error.response.statusText).end();
  }
  return;
};