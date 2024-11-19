import express from '../../../plugins/express';

import {
  verifyUpdateAuthToken,
} from './handlers';

const router = express.Router();

router.get('/payment-update/:updateAuthToken', verifyUpdateAuthToken);

export default router;