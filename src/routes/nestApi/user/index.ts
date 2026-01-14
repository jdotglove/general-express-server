import express from "../../../plugins/express";

import {
    getUserConversations,
} from "./handlers";

const router = express.Router();

router.get("/user/:userId/conversations", getUserConversations);

export default router;