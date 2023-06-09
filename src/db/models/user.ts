import mongoose from '../../plugins/mongoose';
import { Artist } from '../services/artist';
import { Playlist } from '../services/playlist';
import { Track } from '../services/track';

const { Schema } = mongoose;

export interface UserDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  country: string;
  displayName: string;
  email: string;
  images: Array<any>;
  playlists: Array<Playlist['_id']>;
  spotifyUri: string;
  topArtists: Array<Artist['_id']>;
  topTracks: Array<Track['_id']>;
}

const UserSchema = new Schema({
  country: String,
  displayName: String,
  email: String,
  images: {
    of: Schema.Types.Mixed,
    type: Array,
  },
  playlists: {
    of: Schema.Types.ObjectId,
    type: Array,
  },
  spotifyUri: String,
  topArtists: {
    default: [],
    of: Schema.Types.ObjectId,
    type: Array,
  },
  topTracks: {
    default: [],
    of: Schema.Types.ObjectId,
    type: Array,
  },
});

export const UserModel = mongoose.model<UserDocument>('User', UserSchema);