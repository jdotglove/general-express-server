import express from '../plugins/express';

import spotifyAlbumsApi from './spotifyApi/albums';
import spotifyArtistsApi from './spotifyApi/artists';
import spotifyDiscoveryApi from './spotifyApi/discovery';
import spotifyPlaylistsApi from './spotifyApi/playlists';
import spotifyRecommendationsApi from './spotifyApi/recommendations';
import spotifyTracksApi from './spotifyApi/tracks';
import spotifyUsersApi from './spotifyApi/users';
import alexAndAsherCustomerApi from './alexAndAsherApi/customers';
import alexAndAsherManagementApi from './alexAndAsherApi/managment';
import alexAndAsherMessageApi from './alexAndAsherApi/messages';

import { secured } from '../middleware/authorization';

const router = express.Router();

// General Routes

// This section will help you get a list of all the records.
router.use('/spotify', secured, spotifyAlbumsApi);
router.use('/spotify', secured, spotifyArtistsApi);
router.use('/spotify', secured, spotifyDiscoveryApi);
router.use('/spotify', secured, spotifyPlaylistsApi);
router.use('/spotify', secured, spotifyRecommendationsApi);
router.use('/spotify', secured, spotifyTracksApi);
router.use('/spotify', secured, spotifyUsersApi);

router.use('/alex-and-asher', alexAndAsherMessageApi);
router.use('/alex-and-asher', secured, alexAndAsherCustomerApi);
router.use('/alex-and-asher', secured, alexAndAsherManagementApi);


export default router;