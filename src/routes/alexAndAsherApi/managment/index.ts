import express from '../../../plugins/express';

import {
    fetchStripeCustomers,
    createUpdatePaymentRequest,
} from './handlers';

const router = express.Router();

router.get('/management/customers', fetchStripeCustomers);

router.post('/management/update-payment-request', createUpdatePaymentRequest);

export default router;