import mongoose from '../../plugins/mongoose';
import { Artist } from '../services/artist';

const { Schema } = mongoose;

export interface AlbumDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  albumType: string;
  artists: Array<{
    reference: Artist['_id'];
    name: Artist['name'];
  }>;
  availableMarkets: Array<string>;
  name: string;
  releaseDate: string;
  releaseDatePercision: string;
  spotifyUri: string;
  totalTracks: number;
}

const AlbumSchema = new Schema({
  albumType: String,
  artists: [{
    reference: Schema.Types.ObjectId,
    name: String,
  }],
  availableMarkets: {
    of: String,
    type: Array,
  },
  name: String,
  releaseDate: String,
  releaseDatePercision: String,
  spotifyUri: String,
  totalTracks: Number,
});

export const AlbumModel = mongoose.model<AlbumDocument>('Album', AlbumSchema);