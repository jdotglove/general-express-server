import mongoose from "mongoose";

import { nestDBConnection } from "../../../plugins/mongoose";

const { Schema } = mongoose;

export interface MessageDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  body: string;
  conversation: mongoose.Types.ObjectId;
  createdAt: Date;
  sender: string;
  user: mongoose.Types.ObjectId;
  modelUsed: string;
}

const MessageSchema = new Schema({
  body: {
    type: String,
    required: true,
  },
  conversation: {
    type: Schema.Types.ObjectId,
    ref: "Conversation",
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: new Date(),
  },
  sender: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  modelUsed: {
    type: String,
    required: false,
  },
});

export const MessageModel = nestDBConnection.model<MessageDocument>("Message", MessageSchema);