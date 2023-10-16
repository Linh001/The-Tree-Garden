var mongoose = require('mongoose');
var slug = require('mongoose-slug-generator');
mongoose.Promise = global.Promise;
mongoose.plugin(slug);
const Schema = mongoose.Schema;


const invoiceSchema = new Schema({
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'Customer'
    },
    items: [{
      product: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
      },
      quantity: Number
    }],
    totalAmount: Number
  });
  
  const Invoice = mongoose.model('Invoice', invoiceSchema);

  module.exports = Invoice;