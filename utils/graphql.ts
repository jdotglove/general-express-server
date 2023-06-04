import mongoose from '../plugins/mongoose';

export const translateGQLDocument = ({ Id, ...documentWithoutId }: {
  Id: mongoose.Types.ObjectId
} )  => ({
  ...documentWithoutId,
  _id: Id,
});