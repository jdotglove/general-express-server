import mongoose from '../../plugins/mongoose';

const { Schema } = mongoose;

export interface PlaylistDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  ownerUri: string;
  spotifyUri: string;
  tracks: Array<any>;
}

const PlaylistSchema = new Schema({
  name: String,
  ownerUri: String,
  spotifyUri: String,
  tracks: Array,
});

export const PlaylistModel = mongoose.model<PlaylistDocument>('Playlist', PlaylistSchema);