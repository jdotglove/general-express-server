import mongoose from 'mongoose';
import { audioNestDBConnection } from '../../../plugins/mongoose';

const { Schema } = mongoose;

export interface PlaylistDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  ownerId: mongoose.Types.ObjectId;
  ownerUri: string;
  spotifyUri: string;
  tracks: Array<any>;
}

const PlaylistSchema = new Schema({
  name: String,
  ownerId: Schema.Types.ObjectId,
  ownerUri: String,
  spotifyUri: String,
  tracks: Array,
});

export const PlaylistModel = audioNestDBConnection.model<PlaylistDocument>('Playlist', PlaylistSchema);