import { Router } from 'express';

import {
    getPlaylistTracks,
    saveNewPlaylist,
} from './handlers';

const router = Router();

router.get('/playlist/:id/tracks', getPlaylistTracks);

router.post('/playlist/save', saveNewPlaylist);


export default router;