const express = require('express');
const Response = require('../models/Response');
const auth = require('../middleware/auth');
const router = express.Router();

// Get responses by restaurant
router.get('/restaurant/:restaurantId', auth, async (req, res) => {
  try {
    const responses = await Response.find({ 
      restaurant: req.params.restaurantId 
    })
    .populate('section')
    .populate('restaurant')
    .sort({ submittedAt: -1 });
    
    res.json(responses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all responses
router.get('/', auth, async (req, res) => {
  try {
    const responses = await Response.find()
      .populate('section')
      .populate('restaurant')
      .sort({ submittedAt: -1 });
    
    res.json(responses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;