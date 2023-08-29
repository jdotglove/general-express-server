import express from '../../../plugins/express';

import {
    getPlaylist,
    getPlaylistTracks,
} from './handlers';

const router = express.Router();

router.get('/playlist/:id/tracks', getPlaylistTracks);
router.get('/playlist/:id/', getPlaylist);


export default router;