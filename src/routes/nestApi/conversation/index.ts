import express from '../../../plugins/express';

import {
    getAllConversations,
    createNewConversation,
    getConversationMessages,
} from './handlers';

const router = express.Router();

router.get('/conversation', getAllConversations);
router.get('/conversation/:conversationId/messages', getConversationMessages);

router.post('/conversation', createNewConversation);

export default router;