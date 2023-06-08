import mongoose from '../../plugins/mongoose';

const { Schema } = mongoose;

export interface ArtistDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  albums?: Array<mongoose.Types.ObjectId>;
  name: string;
  genres: Array<string>;
  popularity: number;
  spotifyUri: string;
  tracks: Array<mongoose.Types.ObjectId>;
}

const ArtistSchema = new Schema({
  albums: {
    default: [],
    of: Schema.Types.ObjectId,
    type: Array,
  },
  name: String,
  genres: Array,
  popularity: Number,
  spotifyUri: String,
  tracks: {
    of: Schema.Types.ObjectId,
    type: Array,
  },
});

export const ArtistModel = mongoose.model<ArtistDocument>('Artist', ArtistSchema);