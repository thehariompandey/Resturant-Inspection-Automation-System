const express = require('express');
const Question = require('../models/Question');
const auth = require('../middleware/auth');
const router = express.Router();

// Get questions by section
router.get('/section/:sectionId', auth, async (req, res) => {
  try {
    const questions = await Question.find({ 
      section: req.params.sectionId 
    }).sort({ createdAt: -1 });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get questions by restaurant
router.get('/restaurant/:restaurantId', auth, async (req, res) => {
  try {
    const questions = await Question.find({ 
      restaurant: req.params.restaurantId 
    }).populate('section').sort({ createdAt: -1 });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create question
router.post('/', auth, async (req, res) => {
  try {
    const question = new Question({
      text: req.body.text,
      type: req.body.type,
      section: req.body.section,
      restaurant: req.body.restaurant
    });

    const savedQuestion = await question.save();
    res.status(201).json(savedQuestion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete question
router.delete('/:id', auth, async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.json({ message: 'Question deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;