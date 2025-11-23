import express from "../../../plugins/express";

import {
    handleMessageStreaming,
} from "./handlers";

const router = express.Router();

router.get("/knowledge", handleMessageStreaming);

export default router;