import express from '../plugins/express';

import albumsApi from './spotifyApi/albums';
import artistsApi from './spotifyApi/artists';
import discoveryApi from './spotifyApi/discovery';
import playlistsApi from './spotifyApi/playlists';
import recommendationsApi from './spotifyApi/recommendations';
import tracksApi from './spotifyApi/tracks';
import usersApi from './spotifyApi/users';
import { secured } from '../middleware/authorization';

const router = express.Router();

// General Routes

// This section will help you get a list of all the records.
router.use('/spotify', secured, albumsApi);
router.use('/spotify', secured, artistsApi);
router.use('/spotify', secured, discoveryApi);
router.use('/spotify', secured, playlistsApi);
router.use('/spotify', secured, recommendationsApi);
router.use('/spotify', secured, tracksApi);
router.use('/spotify', secured, usersApi)
export default router;