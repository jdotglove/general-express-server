import { UserModel, UserDocument } from '../models/user';

export type User = UserDocument;

export const createUser = (
  userDoc: Partial<User>,
): Promise<User> => UserModel.create(
  userDoc,
) as unknown as Promise<User>;

export const findOneUser = (
  query: any,
  options?: any,
): Promise<User> => UserModel.findOne(
  query,
  options,
) as unknown as Promise<User>;