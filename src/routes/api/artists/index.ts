import { Router } from 'express';

import {
  getArtist,
  searchForArtist,
} from './handlers';

const router = Router();

router.post('/artist/search', searchForArtist);

router.get('/artist/:id', getArtist);


export default router;