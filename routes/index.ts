import { Router } from 'express';
import { secured } from '../middleware/authorization';
import usersApi from './api/users';
import playlistsApi from './api/playlists';

const router = Router();

// General Rout

// This section will help you get a list of all the records.
router.use(secured, usersApi)
router.use(secured, playlistsApi);
export default router;