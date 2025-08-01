import express from 'express';
import Lesson from '../module/Lessons.js'; // Ensure the path is correct

const router = express.Router();

// Get all lessons
router.get('/', async (req, res) => {
  try {
    const lessons = await Lesson.find().sort({ _id: -1 });
    res.json(lessons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Save a lesson
router.post('/', async (req, res) => {
  try {
    const lesson = new Lesson(req.body);
    const saved = await lesson.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;