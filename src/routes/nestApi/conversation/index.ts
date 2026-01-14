import express from "../../../plugins/express";

import {
    createNewConversation,
    getConversationMessages,
    getCouncilMembers,
    updateCouncilMembers,
} from "./handlers";

const router = express.Router();

router.get("/conversation/:conversationId/messages", getConversationMessages);
router.get("/conversation/:conversationId/council", getCouncilMembers);

router.post("/conversation", createNewConversation);
router.post("/conversation/:conversationId/council", updateCouncilMembers);


export default router;