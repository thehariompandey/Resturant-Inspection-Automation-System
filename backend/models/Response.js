const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  section: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Section',
    required: true
  },
  employeePhone: {
    type: String,
    required: true
  },
  employeeName: {
    type: String,
    default: 'Unknown'
  },
  answers: [{
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question'
    },
    questionText: String,
    answer: mongoose.Schema.Types.Mixed
  }],
  submittedAt: {
    type: Date,
    default: Date.now
  },
  flowId: String
});

module.exports = mongoose.model('Response', responseSchema);