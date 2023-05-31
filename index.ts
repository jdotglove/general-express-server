import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import router from './routes';

dotenv.config();


const PORT = process.env.PORT || 5054;
const app = express();

app.use(cors());
app.use(express.json());
app.use(router);



// start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});

function shutdown() {
  console.log('Shutting down...');
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);