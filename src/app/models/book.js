const mongoose = require('mongoose');

// Định nghĩa schema sách
const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  category: String,
  year: Number,
  price: Number,
  quantity: Number,
  currentTimestamp: {
    type: Date,
    default: Date.now,
  },
  expirationTimestamp: Date,
});

// Tạo mô hình sách từ schema
const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
