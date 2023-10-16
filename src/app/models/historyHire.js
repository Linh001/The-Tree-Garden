var mongoose = require('mongoose');
var slug = require('mongoose-slug-generator');
mongoose.Promise = global.Promise;
mongoose.plugin(slug);
const Schema = mongoose.Schema;


const hireHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  items: [
    {
      type: { type: String, enum: ['book'] },
      itemId: { type: mongoose.Schema.Types.ObjectId, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  totalPrice: { type: Number, required: true },
  hireDate: { type: Date, default: Date.now },
});


const HireHistory = mongoose.model('HireHistory', hireHistorySchema);

module.exports = HireHistory;