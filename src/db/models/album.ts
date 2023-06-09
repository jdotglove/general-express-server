import mongoose from '../../plugins/mongoose';
import { Artist } from '../services/artist';

const { Schema } = mongoose;

export interface AlbumDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  albumType: string;
  artists: Array<Artist['_id']>;
  availableMarkets: Array<string>;
  name: string;
  releaseDate: string;
  releaseDatePrecision: string;
  spotifyUri: string;
  totalTracks: number;
}

const AlbumSchema = new Schema({
  albumType: String,
  artists: {
    default: [],
    of: Schema.Types.ObjectId,
    type: Array,
  },
  availableMarkets: {
    of: String,
    type: Array,
  },
  name: String,
  releaseDate: String,
  releaseDatePrecision: String,
  spotifyUri: String,
  totalTracks: Number,
});

export const AlbumModel = mongoose.model<AlbumDocument>('Album', AlbumSchema);