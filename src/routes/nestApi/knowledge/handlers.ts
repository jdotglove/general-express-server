import { knowledgeBot } from "../../../services/knowledge";
import { Request, Response } from "../../../plugins/express";

export const handleMessageStreamingAuthorization = async (req: Request, res: Response, next: Function) => {
  try {
    // Perform authorization logic here (e.g., check API keys, tokens, etc.)
    const authorized = true; // Replace with actual authorization logic

    if (!authorized) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // If authorized, proceed to the next middleware/handler
    next();
  } catch (error) {
    console.error(`Authorization error: ${error}`);
    res.status(500).json({ error: "Authorization failed" });
  }
}

export const handleMessageStreaming = async (req: Request, res: Response) => {
  try {
    const { 
      conversationId,
      userId,
      message,
    } = req.query as { conversationId: string; userId: string; message: string };
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
    res.write(JSON.stringify({ "data": { "type": "status", "status": "Connected", "timestamp": `${Date.now()}` } } ) + "\n");

    const knowledgeResponse = await knowledgeBot(
      message,
      userId,
      conversationId,
    );
    
    // Send initial connection confirmation
    // Send the response via SSE
    res.write(JSON.stringify({ "data": {  "type": "message", "message": `${knowledgeResponse}`, "conversationId": `${conversationId}`, "timestamp": `${Date.now()}` } }));
            
  } catch (error) {
    console.error(`Message processing error: ${error}`);
    res.status(500).json({ error: "Message processing failed" });
  }
}