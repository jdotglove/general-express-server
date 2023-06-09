import { Router } from 'express';

import {
    getPlaylistTracks,
} from './handlers';

const router = Router();

router.get('/playlist/:id/tracks', getPlaylistTracks);


export default router;