const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: false,
    trim: true,
    minlength: 3,
    maxlength: 15
  },
  surname: {
    type: String,
    required: true,
    unique: false,
    trim: true,
    minlength: 3,
    maxlength: 20
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  password: {
    type: String,
    required: true,
    unique: false,
    trim: true,
    minlength: 5
  },
  avatar: {
    type: String
  }
}, {
  timestamps: true
})

const User = mongoose.model('User', userSchema);

module.exports = User;
