import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { connect } from './data/dbConnection';
import { userRouter } from './routes/userRoute';
import cors from 'cors';

dotenv.config();

const app = express();
const port = Number(process.env['PORT']) || 4444;

app.use(
  cors({
    origin: 'http://localhost:4200', // Allow only frontend
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
  })
);

// Middleware
app.use(express.json());

// MongoDB connection
connect()
  .then(() => {
    console.log('MongoDB успешно подключена');
  })
  .catch((error: Error) => {
    console.error('Ошибка подключения к MongoDB:', error);
    process.exit(1);
  });

// Routes
app.use('/api/users', userRouter);

// Basic route для проверки
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'API работает!' });
});

// Error handling
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Что-то пошло не так!' });
});

app.listen(port, () => {
  console.log(`API Сервер запущен на http://localhost:${port}`);
});
