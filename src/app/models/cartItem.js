var mongoose = require('mongoose');
var slug = require('mongoose-slug-generator');
mongoose.Promise = global.Promise;
mongoose.plugin(slug);
const Schema = mongoose.Schema;


const cartItemSchema = new mongoose.Schema({
    product: productSchema, // Nhúng thông tin sản phẩm vào mục giỏ hàng
    quantity: Number,
    // Các trường khác của mục giỏ hàng
});
  
const CartItem = mongoose.model('CartItem', cartItemSchema);

module.exports = CartItem;