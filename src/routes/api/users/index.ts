import express from '../../../plugins/express';

import {
  addToUserQueue,
  createUserPlaylist,
  getCurrentTrackBreakdown,
  getUserTopArtists,
  getUserTopTracks,
  getUserPlaylists,
  loginUser,
} from './handlers';

const router = express.Router();

router.get('/user/:id/playlists', getUserPlaylists);
router.get('/user/:id/playback-state', getCurrentTrackBreakdown);
router.get('/user/:id/top-artists', getUserTopArtists);
router.get('/user/:id/top-tracks', getUserTopTracks);

router.post('/user/:id/queue', addToUserQueue);
router.post('/user/:id/playlist', createUserPlaylist);
router.post('/user/login', loginUser);


export default router;