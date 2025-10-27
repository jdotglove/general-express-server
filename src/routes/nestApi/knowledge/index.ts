import express from "../../../plugins/express";

import {
    handleMessageStreaming,
    handleMessageStreamingAuthorization,
} from "./handlers";

const router = express.Router();

router.post("/knowledge", handleMessageStreamingAuthorization);
router.get("/knowledge", handleMessageStreaming);

export default router;