import "dotenv/config";
import mongoose from "mongoose";

import { Request, Response } from "../../../plugins/express";
import { findManyConversations } from "../../../db/nest/services/conversation";
import { SERVER_RESPONSE_CODES } from "../../../utils/errors";

/**
 * @function getAllConversations
 * @param req
 */
export const getUserConversations = async (req: Request, res: Response) => {
    console.log("Conversations User: ", req.params.userId);
    let payload, statusCode;
    try {
      const foundConversations = await findManyConversations({
        user: new mongoose.Types.ObjectId(req.params.userId),
      });
  
      payload = { success: true, conversations: foundConversations };
      statusCode = SERVER_RESPONSE_CODES.ACCEPTED;
    } catch (error: any) {
      const errorObj = error.response ? {
        status: error.response.status,
        message: error.response.statusText || error.message,
      } : {
        status: error.statusCode || SERVER_RESPONSE_CODES.SERVER_ERROR,
        message: error.message,
      };
      statusCode = errorObj.status;
      payload = { message: "Error getting all conversations!" };
      console.error(`Error getting all conversations: ${JSON.stringify(errorObj)}`);
    } finally {
      res.status(statusCode).send(payload).end();
    }
  }