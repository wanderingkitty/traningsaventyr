import express from 'express';
import { getDb, connect } from '../data/dbConnection';
import { Collection } from 'mongodb';
import { User } from '../models/user.js';
import { validateLogin } from '../data/validation/validateLogin';
import { generateToken } from '../data/authMiddleware';

const userRouter = express.Router();

// GET all users
userRouter.get('/', async (req, res) => {
  try {
    const db = getDb();
    const users = await db.collection('users').find({}).toArray();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error getting users', error });
  }
});

// POST create user
userRouter.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation error',
      details: {
        missingFields: !username
          ? ['username']
          : !password
          ? ['password']
          : ['username', 'password'],
      },
    });
  }

  try {
    await connect();
    const userCollection: Collection<User> = getDb().collection('users');

    const validationResult = await validateLogin(
      username,
      password,
      userCollection
    );

    if (!validationResult.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication failed',
        details: {
          error: validationResult.error,
        },
      });
    }

    const token = generateToken(validationResult.user.userId);

    return res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        token,
        user: {
          userId: validationResult.user.userId,
          name: validationResult.user.name,
          class: validationResult.user.class,
        },
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Server error',
      details: {
        error: 'Please try again later',
      },
    });
  }
});
export { userRouter };
