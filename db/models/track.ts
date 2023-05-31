import mongoose from '../../plugins/mongoose';
import { Artist } from '../services/artist';

const { Schema } = mongoose;

export interface TrackDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  album: any;
  artists: Array<{
    reference: Artist['_id'];
    name: Artist['name'];
  }>;
  availableMarkets: Array<string>;
  duration: number;
  explicit: boolean;
  name: string;
  popularity: number;
  spotifyUri: string;
  trackNumber: number;
}

const TrackSchema = new Schema({
  album: {
    of: Schema.Types.Mixed,
    type: Object,
  },
  artists: [{
    reference: Schema.Types.ObjectId,
    name: String,
  }],
  availableMarkets: {
    of: String,
    type: Array,
  },
  duration: Number,
  explicit: Boolean,
  name: String,
  popularity: Number,
  spotifyUri: String,
  trackNumber: Number,
});

export const TrackModel = mongoose.model<TrackDocument>('Track', TrackSchema);