import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import bodyParser from "body-parser";

import router from "./routes";
import documentIngestion from "./library/utils/document-ingestion";

dotenv.config();


const PORT = process.env.PORT || 5054;
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(helmet());
// Enhanced CORS configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(",") || "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Upgrade", "Connection"],
}));
app.use(express.json());
app.use(router);

app.get("/", (_req, res) => {
  res.send("Hello from App Engine!");
});

function shutdown() {
  console.log("Shutting down...");
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

app.listen(PORT, async () => {
  console.log(`Server is running on port: ${PORT}`);
  console.log(`SSE endpoint available at: http://localhost:${PORT}/events/:userId`);
  //await documentIngestion();
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
}