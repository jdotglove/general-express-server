import mongoose from "mongoose";

import { nestDBConnection } from "../../../plugins/mongoose";

const { Schema } = mongoose;

export interface OrchestrationEventDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  conversation: mongoose.Types.ObjectId;
  createdAt: Date;
  selectedModel: string;
  user: mongoose.Types.ObjectId;
  tags: string[];
  triggerMessage: string;
}

const OrchestrationEventSchema = new Schema({
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
  selectedModel: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  tags: {
    type: Array,
    of: String,
    required: true,
  },
  triggerMessage: {
    type: String,
    required: true,
  },
});

export const OrchestrationEventModel = nestDBConnection.model<OrchestrationEventDocument>("OrchestrationEvent", OrchestrationEventSchema);