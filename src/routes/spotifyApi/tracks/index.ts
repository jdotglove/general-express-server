import express from '../../../plugins/express';

import {
  getSelectedTracks,
  getTrack,
  // getTrackArtists,
  getTrackAudioFeatures,
  searchForTrack,
} from './handlers';

const router = express.Router();

router.post('/track/search', searchForTrack);

router.get('/track/:id/audio-features', getTrackAudioFeatures);
// router.get('/track/:id/artists', getTrackArtists);
router.get('/track/:id', getTrack);
router.get('/track', getSelectedTracks);


export default router;