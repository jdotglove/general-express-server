import mongoose from 'mongoose';

import { alexAndAsherDBConnection } from '../../../plugins/mongoose';

const { Schema } = mongoose;

export interface PaymentUpdateRequestDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  createdAt: Date,
  customerId: mongoose.Types.ObjectId;
  expired: boolean;
  updatedAt: Date,
  updateAuthToken: string;
}

const PaymentUpdateRequestSchema = new Schema({
  createdAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  customerId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Customer',
  },
  expired: {
    type: Boolean,
    required: true,
    default: false,
  },
  updatedAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  updateAuthToken: {
    type: String,
    required: true,
  }
});

export const PaymentUpdateModel = alexAndAsherDBConnection.model<PaymentUpdateRequestDocument>('PaymentUpdateRequest', PaymentUpdateRequestSchema);