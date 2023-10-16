
var mongoose = require('mongoose');
var slug = require('mongoose-slug-generator');
mongoose.Promise = global.Promise;
mongoose.plugin(slug);
const Schema = mongoose.Schema;

const Accountschema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true, // Email phải là duy nhất
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'user'], 
    default: 'user'
  }
});
//const Account = mongoose.model('Account', Accountschema);

// module.exports = Account;


 module.exports = mongoose.model('Account', Accountschema);