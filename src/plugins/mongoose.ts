import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const audioNestUri = process.env.AUDIONEST_MONGODB_URI || '';
const alexAndAsherUri = process.env.ALEX_AND_ASHER_MONGODB_URI || '';

const audioNestDBConnection = mongoose.createConnection(audioNestUri, {
  retryWrites: false,
  serverSelectionTimeoutMS: 30000,
  // @ts-ignore
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const alexAndAsherDBConnection = mongoose.createConnection(alexAndAsherUri, {
  retryWrites: false,
  serverSelectionTimeoutMS: 30000,
  // @ts-ignore
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


// Wait for the connections to be established before proceeding
new Promise<void>((resolve, reject) => {
  alexAndAsherDBConnection.set('setDefaultsOnInsert', true);
  alexAndAsherDBConnection.once('open', () => {
    console.log('AlexAndAsher connected');
    console.log('alexAndAsherDBConnection Connection State:', alexAndAsherDBConnection.readyState); // Should print 1 (connected)
    resolve();
});
alexAndAsherDBConnection.on('error', (err) => {
    console.error('AlexAndAsher connection error:', err);
    reject(err);
});
 
}).then(() => {
  return new Promise<void>((resolve, reject) => {
    audioNestDBConnection.once('open', () => {
      console.log('AudioNest connected');
      console.log('audioNestDBConnection Connection State:', audioNestDBConnection.readyState); // Should print 1 (connected)
      resolve();
  });
  audioNestDBConnection.on('error', (err) => {
      console.error('AudioNest connection error:', err);
      reject(err);
  });
  });
}).then(() => {
  console.log('Both connections established');
}).catch((error) => {
  console.error('Error during connection setup:', error);
});

export {
  alexAndAsherDBConnection,
  audioNestDBConnection,
};