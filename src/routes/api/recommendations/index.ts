import { Router } from 'express';

import {
  generateRecommendations,
  getSeedGenres,
} from './handlers';

const router = Router();

router.post('/recommendations', generateRecommendations);

router.get('/recommendations/seed-genres', getSeedGenres);


export default router;