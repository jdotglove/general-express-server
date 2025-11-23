import { ConversationModel, ConversationDocument } from '../models/conversation';

export type Conversation = ConversationDocument;

export const createConversation = (
  conversationDoc: Partial<Conversation>,
): Promise<Conversation> => ConversationModel.create(
  conversationDoc,
) as unknown as Promise<Conversation>;

export const findOneConversation = (
  query: any,
  projection?: any,
  options?: any,
): Promise<Conversation> => ConversationModel.findOne(
  query,
  projection,
  options,
) as unknown as Promise<Conversation>;

export const findManyConversations = (
  query: any,
  projection?: any,
  options?: any,
): Promise<Conversation[]> => ConversationModel.find(
  query,
  projection,
  options,
) as unknown as Promise<Conversation[]>;

export const updateOneConversation = (
  query: any,
  update: any,
): Promise<void> => ConversationModel.updateOne(
  query,
  update,
) as unknown as Promise<void>;