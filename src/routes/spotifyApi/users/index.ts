import express from '../../../plugins/express';

import {
  addToUserQueue,
  createUserPlaylist,
  getCurrentTrackBreakdown,
  getCurrentUserTopArtists,
  getCurrentUserTopTracks,
  getCurrentUserPlaylists,
  loginUser,
} from './handlers';

const router = express.Router();

router.get('/user/:id/playlists', getCurrentUserPlaylists);
router.get('/user/:id/playback-state', getCurrentTrackBreakdown);
router.get('/user/:id/top-artists', getCurrentUserTopArtists);
router.get('/user/:id/top-tracks', getCurrentUserTopTracks);

router.post('/user/:id/queue', addToUserQueue);
router.post('/user/:id/playlist', createUserPlaylist);
router.post('/user/login', loginUser);


export default router;