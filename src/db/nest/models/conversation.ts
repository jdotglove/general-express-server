import mongoose from "mongoose";

import { nestDBConnection } from "../../../plugins/mongoose";

const { Schema } = mongoose;

export interface ConversationDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  lastMessage: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
}

const ConversationSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
    required: true,
    default: new Date(),
  },
  lastMessage: {
    type: String,
    ref: "Message",
  },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  }
});

export const ConversationModel = nestDBConnection.model<ConversationDocument>("Conversation", ConversationSchema);