import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

dotenv.config();

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(
  serverDistFolder,
  '../dist/traningsaventyr/browser'
);

const app = express();
const angularApp = new AngularNodeAppEngine();
const port: number = Number(process.env['PORT']) || 4444;

// Middleware
app.use('/', express.static('dist/'));
app.use(express.json());
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  })
);

// Logging middleware
app.use('/', (req, _res, next) => {
  console.log(`${req.method} ${req.url}`, req.body);
  next();
});

// API endpoints
app.use('/**', (req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next()
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point.

*/
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export const reqHandler = createNodeRequestHandler(app);
