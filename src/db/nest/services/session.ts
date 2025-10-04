import { SessionModel, SessionDocument } from '../models/session';

export type Session = SessionDocument;

export const createSession = (
  sessionDoc: Partial<Session>,
): Promise<Session> => SessionModel.create(
  sessionDoc,
) as unknown as Promise<Session>;

export const findOneSession = (
  query: any,
  options?: any,
): Promise<Session> => SessionModel.findOne(
  query,
  options,
) as unknown as Promise<Session>;

export const findOneSessionAndUpdate = (
    query: any,
    update: any,
    options?: any,
): Promise<Session> => SessionModel.findOneAndUpdate(
    query,
    update,
    options,
) as unknown as Promise<Session>;

export const updateOneSession = (
    query: any,
    options?: any,
  ): Promise<void> => SessionModel.updateOne(
    query,
    options,
  ) as unknown as Promise<void>;