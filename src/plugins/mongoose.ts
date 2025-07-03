import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const audioNestUri = process.env.AUDIONEST_MONGODB_URI || '';
const alexAndAsherUri = process.env.ALEX_AND_ASHER_MONGODB_URI || '';
const nestUri = process.env.NEST_MONGODB_URI || '';

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

const nestDBConnection = mongoose.createConnection(nestUri, {
  retryWrites: false,
  serverSelectionTimeoutMS: 30000,
  // @ts-ignore
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

new Promise<void>((resolve, reject) => {
  nestDBConnection.set('setDefaultsOnInsert', true);
  nestDBConnection.once('open', () => {
    console.log('Nest connected');
    console.log('nestDBConnection Connection State:', nestDBConnection.readyState); // Should print 1 (connected)
    resolve();
  })
  nestDBConnection.on('error', (err) => {
    console.error('Nest connection error:', err);
    reject(err);
  });
}).catch((error) => {
  console.error('Error during connection setup:', error);
});

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
}).catch((error) => {
  console.error('Error during connection setup:', error);
});

new Promise<void>((resolve, reject) => {
  audioNestDBConnection.once('open', () => {
    console.log('AudioNest connected');
    console.log('audioNestDBConnection Connection State:', audioNestDBConnection.readyState); // Should print 1 (connected)
    resolve();
  });
  audioNestDBConnection.on('error', (err) => {
    console.error('AudioNest connection error:', err);
    reject(err);
  });
}).catch((error) => {
  console.error('Error during connection setup:', error);
});

export {
  alexAndAsherDBConnection,
  audioNestDBConnection,
  nestDBConnection,
};