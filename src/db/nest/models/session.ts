import mongoose from 'mongoose';

import { nestDBConnection } from '../../../plugins/mongoose';

const { Schema } = mongoose;

export interface SessionDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  expiresAt: Date;
  token: string;
  updatedAt: Date;
  user: mongoose.Types.ObjectId;
}

const SessionSchema = new Schema({
  createdAt: {
    type: Date,
    required: true,
    default: new Date(),
  },
  expiresAt: {
    type: Date,
    required: true,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
    required: true,
    default: new Date(),
  },
  token: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  }
});

export const SessionModel = nestDBConnection.model<SessionDocument>('Session', SessionSchema);