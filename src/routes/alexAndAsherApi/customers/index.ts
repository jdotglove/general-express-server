import express from '../../../plugins/express';

import {
  updateUserPaymentInformation,
} from './handlers';

const router = express.Router();

router.put('/customers/:customerId/payment', updateUserPaymentInformation);

export default router;