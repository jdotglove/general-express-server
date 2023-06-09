import { Router } from 'express';

import {
  getSelectedTracks,
  getTrack,
  getTrackArtists,
  getTrackAudioFeatures,
} from './handlers';

const router = Router();

router.get('/track/:id/audio-features', getTrackAudioFeatures);
router.get('/track/:id/artists', getTrackArtists);
router.get('/track/:id', getTrack);
router.get('/track', getSelectedTracks);


export default router;