import express from '../../../plugins/express';

import {
    getInventoryItems,
} from './handlers';

const router = express.Router();

router.get('/inventory', getInventoryItems);

export default router;