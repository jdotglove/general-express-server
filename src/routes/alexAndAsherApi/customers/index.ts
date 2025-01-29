import express from '../../../plugins/express';

import {
  updateUserPaymentInformation,
  verifyUpdateAuthToken,
} from './handlers';

const router = express.Router();

router.put('/customers/:customerId/update-payment', updateUserPaymentInformation);

router.get('/customers/verify-payment-update', verifyUpdateAuthToken);

export default router;