import { Router } from 'express';

import {
  getNewReleases,
  getBrowsingCategories,
  getCategoryPlaylists,
} from './handlers';

const router = Router();

router.get('/discovery/new-releases', getNewReleases);
router.get('/discovery/categories', getBrowsingCategories);
router.get('/discovery/:category/playlists', getCategoryPlaylists);


export default router;