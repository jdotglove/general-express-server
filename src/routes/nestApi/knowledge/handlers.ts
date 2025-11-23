import mongoose from "mongoose";

import { knowledgeBot } from "../../../services/knowledge";
import { Request, Response } from "../../../plugins/express";
import { createMessage } from "../../../db/nest/services/message";
import { updateOneConversation } from "../../../db/nest/services/conversation";

export const handleMessageStreaming = async (req: Request, res: Response) => {
  try {
    const { 
      conversationId,
      userId,
      message,
    } = req.query as { conversationId: string; userId: string; message: string };

    if (!conversationId || !userId || !message) {
      res.status(400).json({ error: "Missing required parameters" }).end();
      return;
    }
    // Set up Server-Sent Events headers
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
      "Access-Control-Allow-Origin": "*",
      "Transfer-Encoding": "chunked",
      "Access-Control-Allow-Headers": "Cache-Control"
    });
    // Send initial connection confirmation
    res.write(JSON.stringify({ "data": { "type": "status", "status": "connected", "timestamp": `${Date.now()}` } } ) + "\n");

    await createMessage({ 
      body: message, 
      createdAt: new Date(), 
      sender: "user", 
      user: new mongoose.Types.ObjectId(userId),
      conversation: new mongoose.Types.ObjectId(conversationId),
    });

    await updateOneConversation({
      _id: new mongoose.Types.ObjectId(conversationId),
    }, {
      updatedAt: new Date(),
      lastMessage: message,
    });

    const knowledgeResponse = await knowledgeBot(
      message,
      conversationId,
    );
    
    res.write(JSON.stringify({ "data": {  "type": "message", "message": `${knowledgeResponse}`, "conversationId": `${conversationId}`, "timestamp": `${Date.now()}` } }) + "\n");
    res.write(JSON.stringify({ "data": { "type": "status", "status": "completed", "timestamp": `${Date.now()}` } } ));
    res.end();
  } catch (error) {
    console.error(`Message processing error: ${error}`);
    res.status(500).json({ error: "Message processing failed" });
  }
}