import { Router } from 'express';

import {
  getTrackArtists,
  getTracksAudioFeatures,
} from './handlers';

const router = Router();

router.post('/track/audio-features', getTracksAudioFeatures);
router.post('/track/:id/artists', getTrackArtists);


export default router;