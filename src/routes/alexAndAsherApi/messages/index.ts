import express from '../../../plugins/express';

import {
  processIncomingMessage,
} from './handlers';

const router = express.Router();

router.post('/messages/sms', processIncomingMessage);

router.get('/messages', (req, res) => {
  res.send("Hello from messages");
});


export default router;