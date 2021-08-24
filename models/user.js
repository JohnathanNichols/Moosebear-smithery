const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String
  },
  username: {
    type: String
  },
  password: {
    type: String
  },
  likedArticles:[{
    type: String
  }],
  updated: {
    type: Date,
    default: Date.now
  },
  adminCode: {
    type: String,
    default: null
  }
});

module.exports = mongoose.model('User', userSchema);
