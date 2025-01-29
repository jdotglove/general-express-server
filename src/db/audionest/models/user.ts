import mongoose from 'mongoose';

import { audioNestDBConnection } from '../../../plugins/mongoose';
import { Artist } from '../services/artist';
import { Playlist } from '../services/playlist';
import { Track } from '../services/track';

const { Schema } = mongoose;

export interface UserDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  acknoledgeInstructions: boolean;
  displayName: string;
  email: string;
  images: Array<any>;
  playlists: Array<Playlist['_id']>;
  spotifyUri: string;
  spotifyId: string;
  topArtists: Array<Artist['_id']>;
  topTracks: Array<Track['_id']>;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema({
  acknoledgeInstructions: {
    type: Boolean,
    required: true,
    default: false,
  },
  displayName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  images: {
    of: Schema.Types.Mixed,
    type: Array,
    required: true,
    default: [],
  },
  playlists: {
    of: Schema.Types.ObjectId,
    type: Array,
    required: true,
    default: [],
  },
  spotifyUri: {
    type: String,
    required: true,
  },
  spotifyId: {
    type: String,
    required: true,
  },
  topArtists: {
    default: [],
    of: Schema.Types.ObjectId,
    type: Array,
    required: true,
  },
  topTracks: {
    default: [],
    of: Schema.Types.ObjectId,
    type: Array,
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
});

export const UserModel = audioNestDBConnection.model<UserDocument>('User', UserSchema);