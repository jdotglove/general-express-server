import mongoose from "mongoose";

import { nestDBConnection } from "../../../plugins/mongoose";

const { Schema } = mongoose;

export interface CouncilMemberDocument extends mongoose.Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    baseModel: string;
    basePersona: string;
    createdAt: Date;
    updatedAt: Date;
    user: mongoose.Types.ObjectId;
    conversation: mongoose.Types.ObjectId;
    councilListingOrder: number;
    active: boolean;
}

const CouncilMemberSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    baseModel: {
        type: String,
        required: true,
    },
    basePersona: {
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
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    conversation: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Conversation",
    },
    councilListingOrder: {
        type: Number,
        required: true,
    },
    active: {
        type: Boolean,
        required: true,
        default: true,
    }
});

export const CouncilMemberModel = nestDBConnection.model<CouncilMemberDocument>("CouncilMember", CouncilMemberSchema);