const router = require('express').Router();
const Post = require('../models/posts.model');
const urlencodedParser = require('./urlEncoded');//to post requests

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const secret_key = process.env.SECRET_KEY || 'secret';

router.route('/').get( (req, res) => {
  Post.find()
    .then( posts => res.json(posts))
    .catch( err => res.status(400).json('Error: ' + err))
})

router.route('/add').post(urlencodedParser, (req, res) => {
  const userId = req.body.userId;
  const userName = req.body.userName;
  const userSurname = req.body.userSurname;
  const text = req.body.text;
  const likes = req.body.likes;
  const likesArray = req.body.likesArray;

  const newPost = new Post({ userId, userName, userSurname, text, likes, likesArray });
  newPost.save()
    .then( () => res.json('post added'))
    .catch( err => res.send('error occured'))
})

router.route('/:id').get( (req, res) => {
  Post.findById(req.params.id)
    .then( post => res.json(post))
    .catch( err => res.status(400).json('Error ' + err))
})

router.route('/:id').delete( (req,res) => {
  Post.findByIdAndDelete(req.params.id)
    .then( post => res.json(`${post} deleted`))
    .catch( err => res.status(400).json('Error' + err))
})

router.route('/update/:id').post(urlencodedParser, (req,res) => {
  Post.findById(req.params.id)
    .then( post => {
      post.userId = req.body.userId;
      post.name = req.body.name;
      post.surname = req.body.surname;
      post.text = req.body.text;
      post.likes = req.body.likes;
      post.likesArray = req.body.likesArray;

      post.save()
        .then( () => res.json('post updated'))
        .catch( (err) => res.status(400).json('Error ' + err))
    })
    .catch( err => res.status(400).json('Error ' + err))
})

module.exports = router;
