const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postSchema = new Schema({
  userId: {
    type: String,
    required: true,
    unique: false,
    trim: true
  },
  userName: {
    type: String,
    required: true,
    unique: false,
    trim: true
  },
  userSurname: {
    type: String,
    required: true,
    unique: false,
    trim: true
  },
  text: {
    type: String,
    required: true,
    unique: false,
    trim: true,
    minlength: 3,
    maxlength: 120
  },
  likes: {
    type: Number
  },
  likesArray: {
    type: Array
  }
}, {
  timestamps: true
})

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
