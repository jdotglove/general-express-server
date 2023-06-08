import { Router } from 'express';

import {
  getUserTopArtists,
  getUserTopTracks,
  getUserPlaylists,
  loginUser,
} from './handlers';

const router = Router();

router.post('/user/:id/playlists', getUserPlaylists);
router.post('/user/:id/top-artists', getUserTopArtists);
router.post('/user/:id/top-tracks', getUserTopTracks);

router.post('/user/login', loginUser);


export default router;