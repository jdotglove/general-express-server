import { Router } from 'express';

import artistsApi from './api/artists';
import playlistsApi from './api/playlists';
import recommendationsApi from './api/recommendations';
import tracksApi from './api/tracks';
import usersApi from './api/users';
import { secured } from '../middleware/authorization';

const router = Router();

// General Routes

// This section will help you get a list of all the records.
router.use(secured, artistsApi);
router.use(secured, playlistsApi);
router.use(secured, recommendationsApi);
router.use(secured, tracksApi);
router.use(secured, usersApi)
export default router;