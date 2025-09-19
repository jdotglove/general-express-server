import { ConversationModel, ConversationDocument } from '../models/conversation';

export type Conversation = ConversationDocument;

export const createConversation = (
  conversationDoc: Partial<Conversation>,
): Promise<Conversation> => ConversationModel.create(
  conversationDoc,
) as unknown as Promise<Conversation>;

export const findOneConversation = (
  query: any,
  options?: any,
): Promise<Conversation> => ConversationModel.findOne(
  query,
  options,
) as unknown as Promise<Conversation>;

export const findManyConversations = (
  query: any,
  options?: any,
): Promise<Conversation[]> => ConversationModel.find(
  query,
  options,
) as unknown as Promise<Conversation[]>;