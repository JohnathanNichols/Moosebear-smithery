const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"]
  },
  content: {
    type: String,
    required: [true, "Content can't be blank"]
  },
  price: {
    type: Number,
    min: 0,
    default: 0,
    required: [true, "Price can't be blank"]
  },
  currency: {
    type: String,
    default: "$",
    required: [true, "Currency can't be blank"]
  },
  imageResult:{
    type: Buffer
  },
  imageName:{
    type: String,
    default: ""
  },
  updated: {
    type: Date,
    default: Date.now,
    required: [true, "Date can't be blank"]
  },
  home: {
    type: Boolean,
    default: true
  },
  all: {
    type: Boolean,
    default: true
  },
  print: {
    type: Boolean,
    default: true
  },
  jewelry: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('Article', articleSchema);
