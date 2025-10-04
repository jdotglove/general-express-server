import mongoose from 'mongoose';

import { nestDBConnection } from '../../../plugins/mongoose';

const { Schema } = mongoose;

export interface UserDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  username: string;
  password: string;
  createdAt: Date;
}

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: new Date(),
  },
});

export const UserModel = nestDBConnection.model<UserDocument>('User', UserSchema);