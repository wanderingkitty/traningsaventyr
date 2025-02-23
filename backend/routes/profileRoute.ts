import express from 'express';
import { getDb, connect } from '../data/dbConnection';
import { Collection } from 'mongodb';
import { User } from '../models/user.js';
import { CharacterProfile } from '../models/character';

const profileRouter = express.Router();

profileRouter.get('/', async (req, res) => {
  try {
    const db = getDb();
    const profiles = await db.collection('profiles').find({}).toArray();
    res.json(profiles);
  } catch (error: any) {
    res.status(500).json({ message: 'Error getting profiles' });
  }
});

profileRouter.get('/:userId', async (req, res) => {
  try {
    const db = getDb();
    const profile = await db.collection('profiles').findOne({
      userId: req.params.userId,
    });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(profile);
  } catch (error: any) {
    res.status(500).json({ message: 'Error getting profile' });
  }
});

profileRouter.post('/', async (req, res) => {
  try {
    const db = getDb();
    const profilesCollection = db.collection('profiles');

    const newProfile = {
      userId: req.body.userId,
      username: req.body.username, // Добавляем имя пользователя
      selectedCharacterName: req.body.selectedCharacterName,
      characterData: req.body.characterData,
    };

    console.log('Saving profile:', newProfile);

    const result = await profilesCollection.insertOne(newProfile);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

export default profileRouter;
