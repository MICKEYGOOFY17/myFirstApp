var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var restaurant = new Schema({
  name: {
    type: String,
    required: true
  },
  address: {
      type: String,
      required: true
  },
  image: {
    type: String,
    required: true
  },
  rating: {
      type: String,
      required: true
  },
  id: {
    type: String,
    required: true
  }
})

/* schema for user */
var userSchema = new Schema({
  username: {
    type : String,
    required : true,
    unique: true
  },
  password: {
    type : String,
    required : true
  },
  number: {
    type: String,
    required: true
  },
  favIds: [String],
  Restaurant: [restaurant]
});

const User = mongoose.model('User', userSchema);

module.exports = User;
