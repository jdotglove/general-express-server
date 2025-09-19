import { MessageModel, MessageDocument } from '../models/message';

export type Message = MessageDocument;

export const createMessage = (
  messageDoc: Partial<Message>,
): Promise<Message> => MessageModel.create(
  messageDoc,
) as unknown as Promise<Message>;

export const findOneMessage = (
  query: any,
  options?: any,
): Promise<Message> => MessageModel.findOne(
  query,
  options,
) as unknown as Promise<Message>;

export const findManyMessages = (
  query: any,
  options?: any,
): Promise<Message[]> => MessageModel.find(
  query,
  options,
) as unknown as Promise<Message[]>;