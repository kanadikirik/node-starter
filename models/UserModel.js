const mongoose = require('mongoose'),
      Schema   = mongoose.Schema;

mongoose.set('debug',true);
mongoose.Promise = Promise;

const userSchema = new Schema({
  username  : {type: String, required: true, unique: true},
  email     : {type: String, required: true, unique: true},
  password  : {type: String, required: true},
  createdAt : {type: Date, default: Date.now()},
  type      : {type: Number, default: 1}
})

module.exports = mongoose.model("User", userSchema);