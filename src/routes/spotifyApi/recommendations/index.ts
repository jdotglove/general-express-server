import express from '../../../plugins/express';

import {
  generateRecommendations,
  getSeedGenres,
} from './handlers';

const router = express.Router();

router.post('/recommendations', generateRecommendations);

router.get('/recommendations/seed-genres', getSeedGenres);


export default router;