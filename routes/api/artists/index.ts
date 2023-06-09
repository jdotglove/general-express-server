import { Router } from 'express';

import {
    getArtist,
} from './handlers';

const router = Router();

router.get('/artist/:id', getArtist);


export default router;