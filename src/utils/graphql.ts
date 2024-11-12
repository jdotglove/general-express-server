import mongoose from 'mongoose';

export const translateGQLDocument = ({ Id, ...documentWithoutId }: {
  Id: mongoose.Types.ObjectId
} )  => ({
  ...documentWithoutId,
  _id: Id,
});