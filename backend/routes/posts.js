import express from 'express';
import { createReply } from '../models/database.js';

const router = express.Router();

// POST /api/posts - Create a reply
router.post('/', async (req, res) => {
  try {
    const { threadId, comment, author, image } = req.body;

    if (!threadId || !comment) {
      return res.status(400).json({ error: 'Thread ID and comment are required' });
    }

    const newReply = await createReply(threadId, comment, author, image);
    res.status(201).json(newReply);
  } catch (error) {
    console.error('Error creating reply:', error);
    res.status(500).json({ error: 'Failed to create reply' });
  }
});

export default router;