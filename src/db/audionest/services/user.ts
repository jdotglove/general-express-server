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

export const findOneUserAndUpdate = (
  query: any,
  update: any,
  options?: any,
): Promise<User> => UserModel.findOneAndUpdate(
  query,
  update,
  options,
) as unknown as Promise<User>;

// TODO: come back to type this for checking modified success
export const updateOneUser = (
  query: any,
  options?: any,
): Promise<void> => UserModel.updateOne(
  query,
  options,
) as unknown as Promise<void>;