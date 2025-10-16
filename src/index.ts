import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import { RawData, WebSocketServer } from 'ws';
import { createServer } from 'http';

import router from './routes';
import { knowledgeBot } from './services/knowledge';

dotenv.config();


const PORT = process.env.PORT || 5054;
const app = express();

const server = createServer(app);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(router);

app.get('/', (_req, res) => {
  res.send('Hello from App Engine!');
});


// Attach WebSocket server to the HTTP server
const wss = new WebSocketServer({ 
  server,
  path: '/ws',
});

// Handle WebSocket connections
wss.on('connection', (ws) => {
  console.log('WebSocket client connected!');
  ws.on('message', async (message: RawData) => {
    const payload = JSON.parse(message.toString());
    const response = await knowledgeBot(payload.message, payload.userId, payload.conversationId);
    
    ws.send(response);
  });
});

function shutdown() {
  console.log('Shutting down...');
  process.exit(0);
}

// optional: see upgrade attempts
server.on('upgrade', (req) => {
  console.log('HTTP upgrade', { url: req.url, origin: req.headers.origin });
});

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

server.listen(PORT, async () => {
  console.log(`Server is running on port: ${PORT}`);
});

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