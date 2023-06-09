import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const uri = process.env.MONGODB_URI || '';

mongoose.Promise = global.Promise;
mongoose.connect(uri, {
  retryWrites: false,
  serverSelectionTimeoutMS: 60000,
  // @ts-ignore
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Globally establish that defaults should be set when inserting into a collection
mongoose.set('setDefaultsOnInsert', true);

mongoose.connection.on('connected', function () {
  console.log('Mongo DB connection open');
});

export default mongoose;