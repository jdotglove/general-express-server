import { MessageModel, MessageDocument } from '../models/message';

export type Message = MessageDocument;

export const createMessage = (
  messageDoc: Partial<Message>,
): Promise<Message> => MessageModel.create(
  messageDoc,
) as unknown as Promise<Message>;

export const findOneMessage = (
  query: any,
  projection?: any,
  options?: any,
): Promise<Message> => MessageModel.findOne(
  query,
  projection,
  options,
) as unknown as Promise<Message>;

export const findManyMessages = (
  query: any,
  projection?: any,
  options?: any,
): Promise<Message[]> => MessageModel.find(
  query,
  projection,
  options,
) as unknown as Promise<Message[]>;