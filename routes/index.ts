import { Router } from 'express';

import playlistsApi from './api/playlists';
import tracksApi from './api/tracks';
import usersApi from './api/users';
import { secured } from '../middleware/authorization';

const router = Router();

// General Rout

// This section will help you get a list of all the records.
router.use(secured, playlistsApi);
router.use(secured, tracksApi);
router.use(secured, usersApi)
export default router;