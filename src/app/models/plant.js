const mongoose = require('mongoose');

// Định nghĩa schema sách
const plantSchema = new mongoose.Schema({
    name: String,
    type: String,
    age: Number,
  });

// Tạo mô hình sách từ schema
const Plant = mongoose.model('Plant', plantSchema);

module.exports = Plant;


