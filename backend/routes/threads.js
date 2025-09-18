import express from 'express';
import { getThreads, createThread } from '../models/database.js';

const router = express.Router();

// GET /api/threads - Get all threads
router.get('/', async (req, res) => {
  try {
    const threads = await getThreads();
    res.json(threads);
  } catch (error) {
    console.error('Error fetching threads:', error);
    res.status(500).json({ error: 'Failed to fetch threads' });
  }
});

// POST /api/threads - Create a new thread
router.post('/', async (req, res) => {
  try {
    const { subject, comment, author, image } = req.body;

    if (!subject || !comment) {
      return res.status(400).json({ error: 'Subject and comment are required' });
    }

    if (!image) {
      return res.status(400).json({ error: 'Image is required for new threads' });
    }

    const newThread = await createThread(subject, comment, author, image);
    res.status(201).json(newThread);
  } catch (error) {
    console.error('Error creating thread:', error);
    res.status(500).json({ error: 'Failed to create thread' });
  }
});

export default router;