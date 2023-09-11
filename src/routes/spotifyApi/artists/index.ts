import express from '../../../plugins/express';

import {
  getArtist,
  searchForArtist,
} from './handlers';

const router = express.Router();

router.post('/artist/search', searchForArtist);

router.get('/artist/:id', getArtist);


export default router;