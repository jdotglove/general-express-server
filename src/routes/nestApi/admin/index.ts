import express from '../../../plugins/express';

import {
    adminLogin,
    createAdmin,
} from './handlers';

const router = express.Router();

router.post('/admin/login', adminLogin);
router.post('/admin/create', createAdmin);

export default router;