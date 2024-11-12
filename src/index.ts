import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';

import router from './routes';

dotenv.config();


const PORT = process.env.PORT || 5054;
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(router);


app.get('/', (req, res) => {
  res.send('Hello from App Engine!');
});

// start the Express server
const server = app.listen(PORT, async () => {
  console.log(`Server is running on port: ${PORT}`);
});

function shutdown() {
  console.log('Shutting down...');
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

/**
 * Webpack HMR Activation
 */

type ModuleId = string | number;

interface WebpackHotModule {
  hot?: {
    data: any;
    accept(
      dependencies: string[],
      callback?: (updatedDependencies: ModuleId[]) => void,
    ): void;
    accept(dependency: string, callback?: () => void): void;
    accept(errHandler?: (err: Error) => void): void;
    dispose(callback: (data: any) => void): void;
  };
}

declare const module: WebpackHotModule;

if (module.hot) {
  module.hot.accept();
  module.hot.dispose(() => server.close());
}