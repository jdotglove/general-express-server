import "dotenv/config";
import mongoose from "mongoose";

import { Request, Response } from "../../../plugins/express";
import { findManyConversations, createConversation } from "../../../db/nest/services/conversation";
import { findOneUser } from "../../../db/nest/services/user";
import { NestError, SERVER_RESPONSE_CODES } from "../../../utils/errors";
import { findManyMessages } from "../../../db/nest/services/message";
import { createCouncilMember, findManyCouncilMembers, updateOneCouncilMember } from "../../../db/nest/services/council-member";

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
    if (!req.body.userId || !req.body.name) {
      throw new NestError("userId and name are required", SERVER_RESPONSE_CODES.BAD_REQUEST);
    }

    const foundUser = await findOneUser({ _id: new mongoose.Types.ObjectId(req.body.userId) });

    if (!foundUser?._id) {
      throw new NestError(`Cannot find user with id ${req.body.userId}`, SERVER_RESPONSE_CODES.NOT_FOUND);
    }

    const newConversation = await createConversation({
      user: foundUser._id,
      name: req.body.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await createCouncilMember({
      conversation: newConversation._id,
      name: "Existensial Lens",
      baseModel: "claude-sonnet-4-5-20250929",
      user: foundUser._id,
      basePersona: "Use Jean-Paul Sartre's philosophical perspectives and focused, analytical approach to inform your responses. You do not need to announce that this is what you are doing, just respond in that style. Do not be overly obvious about the philosophical element you are following, keep responses resembling normal conversational flow. Limit actions as a response.",
      councilListingOrder: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      active: true,
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
  let payload;
  let statusCode: number;
  try {
    const foundMessages = await findManyMessages({
      conversation: new mongoose.Types.ObjectId(req.params.conversationId),
    });
    payload = { success: true, messages: foundMessages };
    statusCode = SERVER_RESPONSE_CODES.ACCEPTED;
    res.status(statusCode).send(payload).end();
  } catch (error: unknown) {
    const { message: errMessage } = error as Error;
    const errorObj = {
        status: SERVER_RESPONSE_CODES.SERVER_ERROR,
        message: errMessage,
      };
    statusCode = errorObj.status;
    payload = { message: "Error getting conversation messages!" };
    console.error(`Error getting conversation messages: ${JSON.stringify(errorObj)}`);
    res.status(statusCode).send(payload).end();
  } finally {

  }
}
/**
 * @function getCouncilMembers
 * @param req 
 * @member params.conversationID - Conversation to get council members for
 * @param res 
 */
export const getCouncilMembers = async (req: Request, res: Response) => {
  let payload;
  let statusCode: number;
  try {
    const userCouncil = await findManyCouncilMembers({
      conversation: new mongoose.Types.ObjectId(req.params.conversationId),
    });

    payload = {
      success: true,
      councilMembers: userCouncil,
    };
    statusCode = SERVER_RESPONSE_CODES.ACCEPTED;
  } catch (error: unknown) {
    const { message: errMessage } = error as Error;
    const errorObj = {
      status: SERVER_RESPONSE_CODES.SERVER_ERROR,
      message: errMessage,
    };
    statusCode = errorObj.status;
    payload = { message: "Error getting conversation council members!" };
    console.error(`Error getting conversation council members: ${JSON.stringify(errorObj)}`);
  }
  
  res.status(statusCode).send(payload).end(); 
}
/**
 * @function updateCouncilMembers
 * @param req
 * @member body.councilMembers - Updated list of council members
 * @member params.conversationID - Conversation to update council members for
 * @param res 
 */
export const updateCouncilMembers = async (req: Request, res: Response) => {
  let payload;
  let statusCode: number;
  try {

    if (!req.body.councilMembers || !Array.isArray(req.body.councilMembers)) {
      throw new NestError("councilMembers array is required in the request body", SERVER_RESPONSE_CODES.BAD_REQUEST);
    }
    const { councilMembers } = req.body;
    councilMembers.forEach(async (member: any) => {
      await updateOneCouncilMember({
        councilListingOrder: member.councilListingOrder,
      }, {
        name: member.name,
        baseModel: member.baseModel,
        basePersona: member.basePersona,
        active: member.active,
      });
    });
    
    payload = {
      success: true,
    };
    statusCode = SERVER_RESPONSE_CODES.ACCEPTED;
  } catch (error: unknown) {
    const { message: errMessage } = error as Error;
    const errorObj = {
      status: SERVER_RESPONSE_CODES.SERVER_ERROR,
      message: errMessage,
    };
    statusCode = errorObj.status;
    payload = { message: "Error updating conversation council members!" };
    console.error(`Error updating conversation council members: ${JSON.stringify(errorObj)}`);
  }
  res.status(statusCode).send(payload).end();
}