import { Router } from 'express';

import {
  getUserTopArtists,
  getUserTopTracks,
  getUserPlaylists,
  loginUser,
} from './handlers';

const router = Router();

router.get('/user/:id/playlists', getUserPlaylists);
router.get('/user/:id/top-artists', getUserTopArtists);
router.get('/user/:id/top-tracks', getUserTopTracks);

router.post('/user/login', loginUser);


export default router;