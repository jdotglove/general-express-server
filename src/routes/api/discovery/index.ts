import { Router } from 'express';

import {
  getNewReleases,
} from './handlers';

const router = Router();

router.get('/discovery/new-releases', getNewReleases);


export default router;