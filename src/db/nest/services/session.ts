import { SessionModel, SessionDocument } from '../models/session';

export type Session = SessionDocument;

export const createSession = (
  sessionDoc: Partial<Session>,
): Promise<Session> => SessionModel.create(
  sessionDoc,
) as unknown as Promise<Session>;

export const findOneSession = (
  query: any,
  projection?: any,
  options?: any,
): Promise<Session> => SessionModel.findOne(
  query,
  projection,
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
    update: any,
  ): Promise<void> => SessionModel.updateOne(
    query,
    update,
  ) as unknown as Promise<void>;