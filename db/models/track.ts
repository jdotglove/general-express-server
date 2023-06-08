import mongoose from '../../plugins/mongoose';
import { Artist } from '../services/artist';

const { Schema } = mongoose;

type TrackAudioFeatures = {
  acousticness: number;
  analysisUrl: string;
  danceability: number;
  energy: number;
  instrumentalness: number;
  key: number;
  liveness: number;
  loudness: number;
  mode: number;
  speechiness: number;
  spotifyUri: string;
  tempo: number;
  timeSignature: number;
  valence: number;
}


export interface TrackDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  album: any;
  artists: Array<Artist['_id']>;
  audioFeatures: TrackAudioFeatures;
  availableMarkets: Array<string>;
  durationMs: number;
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
  artists: {
    default: [],
    of: Schema.Types.ObjectId,
    type: Array,
  },
  availableMarkets: {
    of: String,
    type: Array,
  },
  audioFeatures: {
    of: Schema.Types.Mixed,
    type: Array
  },
  durationMs: Number,
  explicit: Boolean,
  name: String,
  popularity: Number,
  spotifyUri: String,
  trackNumber: Number,
});

export const TrackModel = mongoose.model<TrackDocument>('Track', TrackSchema);