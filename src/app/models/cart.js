var mongoose = require('mongoose');
var slug = require('mongoose-slug-generator');
mongoose.Promise = global.Promise;
mongoose.plugin(slug);
const Schema = mongoose.Schema;


const cartSchema = new mongoose.Schema({
 // customer_id: mongoose.Types.ObjectId, // Tham chiếu đến khách hàng
//  total_price: Number,
  //items: [cartItemSchema], // Mảng các mục giỏ hàng
  user:{ type: String },
  type: { type: String, enum: ['book', 'plant'] },
  itemId: { type: String },
  quantity: { type: Number, default: 1 }
});
  
const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;