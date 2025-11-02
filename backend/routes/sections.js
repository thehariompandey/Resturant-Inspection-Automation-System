const express = require('express');
const Section = require('../models/Section');
const auth = require('../middleware/auth');
const router = express.Router();

// Get sections by restaurant
router.get('/restaurant/:restaurantId', auth, async (req, res) => {
  try {
    const sections = await Section.find({ 
      restaurant: req.params.restaurantId 
    }).sort({ createdAt: -1 });
    res.json(sections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create section
router.post('/', auth, async (req, res) => {
  try {
    const section = new Section({
      name: req.body.name,
      restaurant: req.body.restaurant
    });

    const savedSection = await section.save();
    res.status(201).json(savedSection);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete section
router.delete('/:id', auth, async (req, res) => {
  try {
    const section = await Section.findByIdAndDelete(req.params.id);
    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }
    res.json({ message: 'Section deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;