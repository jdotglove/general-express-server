import mongoose from 'mongoose';

import { alexAndAsherDBConnection } from '../../../plugins/mongoose';

const { Schema } = mongoose;

export interface CustomerDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  email: string;
  name: string;
  stripeId: string;
  updatedAt: Date;
}

const CustomerSchema = new Schema({
  createdAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  stripeId: {
    type: String,
    required: true,
  },
  updatedAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});

export const CustomerModel = alexAndAsherDBConnection.model<CustomerDocument>('Customer', CustomerSchema);