import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import profileRouter from './routes/profileRoute';
import { userRouter } from './routes/userRoute';
import { connect } from './data/dbConnection';

// Set up __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const port = Number(process.env['PORT']) || 4444;

// Middleware
app.use(express.json());

// API Routes
app.use('/api/users', userRouter);
app.use('/api/profiles', profileRouter);

// MongoDB connection
connect()
  .then(() => {
    console.log('MongoDB connection successful');
  })
  .catch((error: Error) => {
    console.error('MongoDB connection error:', error);
    // Don't exit process in production; just log the error
    if (process.env['NODE_ENV'] !== 'production') {
      process.exit(1);
    }
  });

// Serve Angular static files (for production only)
if (process.env['NODE_ENV'] === 'production') {
  // Serve static files from the Angular app build directory
  app.use(express.static(path.join(__dirname, 'dist/traningsaventyr')));

  // For all GET requests that aren't to the API, serve the Angular app
  app.get('*', (req, res) => {
    if (!req.url.startsWith('/api/')) {
      res.sendFile(path.join(__dirname, 'dist/traningsaventyr/index.html'));
    }
  });
}

// Error handling
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
