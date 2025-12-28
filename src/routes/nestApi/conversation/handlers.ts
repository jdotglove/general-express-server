import "dotenv/config";
import mongoose from "mongoose";

import { Request, Response } from "../../../plugins/express";
import {  } from "../../../utils/constants";
import { findManyConversations, createConversation } from "../../../db/nest/services/conversation";
import { findOneUser } from "../../../db/nest/services/user";
import { NestError, SERVER_RESPONSE_CODES } from "../../../utils/errors";
import { findManyMessages } from "../../../db/nest/services/message";

/**
 * @function getAllConversations
 * @param req
 */
export const getAllConversations = async (req: Request, res: Response) => {
  let payload, statusCode;
  try {
    const foundConversations = await findManyConversations({
      username: req.body.username,
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

/**
 * @function createNewConversation
 * @param req
 * @member body.userId - User ID to associate the conversation with
 * @member body.name - Name of the new conversation
 */
export const createNewConversation = async (req: Request, res: Response) => {
  let payload, statusCode;
  try {
    console.log("Creating new conversation with body: ", req.body);
    if (!req.body.userId || !req.body.name) {
      throw new NestError("userId and name are required", SERVER_RESPONSE_CODES.BAD_REQUEST);
    }

    const foundUser = await findOneUser({ _id: new mongoose.Types.ObjectId(req.body.userId) });

    if (!foundUser?._id) {
      throw new NestError(`Cannot find user with id ${req.body.userId}`, SERVER_RESPONSE_CODES.NOT_FOUND);
    }

    await createConversation({
      user: foundUser._id,
      name: req.body.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    statusCode = SERVER_RESPONSE_CODES.CREATED;
    payload = { success: true, message: "Conversation created successfully" };
  } catch (error: any) {
    const errorObj = error.response ? {
      status: error.response.status,
      message: error.response.statusText || error.message,
    } : {
      status: error.statusCode || SERVER_RESPONSE_CODES.SERVER_ERROR,
      message: error.message,
    };
    statusCode = errorObj.status;
    payload = { message: "Error creating conversation!" };
    console.error(`Error creating conversation: ${JSON.stringify(errorObj)}`);
  } finally {
    res.status(statusCode).send(payload).end();
  }
}

/**
 * @function getConversationMessages
 * @param req
 * @member params.conversationId - Conversation ID to get messages for
 */
export const getConversationMessages = async (req: Request, res: Response) => {
  try {
    const foundMessages = await findManyMessages({
      conversation: new mongoose.Types.ObjectId(req.params.conversationId),
    });

    res.status(SERVER_RESPONSE_CODES.ACCEPTED).send({ success: true, messages: foundMessages }).end();
  } catch (error: any) {
    const errorObj = error.response ? {
      status: error.response.status,
      message: error.response.statusText || error.message,
    } : {
      status: error.statusCode || SERVER_RESPONSE_CODES.SERVER_ERROR,
      message: error.message,
    };
    const statusCode = errorObj.status;
    const payload = { message: "Error getting conversation messages!" };
    console.error(`Error getting conversation messages: ${JSON.stringify(errorObj)}`);
    res.status(statusCode).send(payload).end();
  }
}