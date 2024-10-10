const mongoose = require('mongoose');

const FAQSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    default: 0
  }
});

module.exports = () => {
  if (global.faqConnection) {
    return global.faqConnection.model('FAQ', FAQSchema);
  }
  throw new Error('FAQ database connection not established');
};
