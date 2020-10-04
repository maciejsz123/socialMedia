const router = require('express').Router();
const User = require('../models/users.model');
const urlencodedParser = require('./urlEncoded');//to post requests
const multer = require('multer');
const fs = require('fs');
const { promisify } = require('util');
const unlinkAsync = promisify(fs.unlink)

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './socialmedia/src/uploads')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + '-' + file.originalname)
  }
})

var upload = multer({ storage: storage }).single('avatar')

router.post('/avatarupdate/:id', upload, (req, res, next) => {
  User.findById(req.params.id)
  .then( (user) => {
    const oldAvatar = user.avatar;
    user.avatar = req.file.filename;
    user.save()
      .then( () => {
        if(oldAvatar === 'none.png') {
          res.send('avatar changed');
        } else {
          unlinkAsync(`./socialmedia/src/uploads/${oldAvatar}`)
          res.send('avatar changed');
        }
      })
      .catch( (err) => res.status(400).json('Error ' + err))
  })
  .catch( (err) => res.status(400).json('Error ' + err))
})
/*router.delete('/avatardelete/:id', (req, res, next) => {
  User.findById(req.params.id)
    .then( user => {
      const oldAvatar = user.avatar;
      user.avatar = 'none.png';
      user.save()
      .then( () => {
        res.send('deleted');
        unlinkAsync(`./socialmedia/src/uploads/${oldAvatar}`);
      })
      .catch( err =>  res.status(400).json(err))
    })
    .catch( err => res.status(400).json(err))
})*/

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const secret_key = process.env.SECRET_KEY || 'secret';

router.route('/').get( (req, res) => {
  User.find()
    .then( users => res.json(users))
    .catch( err => res.status(400).json('Error: ' + err))
})

router.route('/register').post(urlencodedParser, (req, res) => {
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    const name = req.body.name;
    const surname = req.body.surname;
    const username = req.body.username;
    const password = hash;
    const avatar = 'none.png';

    const newUser = new User({ name, surname, username, password, avatar });

    newUser.save()
      .then( () => res.json('User added'))
      .catch( err => res.send('user arleady exists'))
  })
})

router.route('/login').post(urlencodedParser, (req, res) => {
  User.findOne({'username': req.body.username})
    .then( user => {
      if(user) {
        if(bcrypt.compareSync(req.body.password, user.password)) {
          const token = jwt.sign(user.toJSON(), secret_key, {
            expiresIn: 1440
          });
          res.send(user);
        } else {
          res.send('error')
        }
      } else {
        res.send('error')
      }
    })
    .catch( err => {
      res.status(400).json('Error ' + err);
    })
})

router.route('/:id').get( (req, res) => {
  User.findById(req.params.id)
    .then( user => res.json(user))
    .catch( err => res.status(400).json('Error ' + err))
})

router.route('/:id').delete( (req,res) => {
  User.findByIdAndDelete(req.params.id)
    .then( user => res.json(`${user} deleted`))
    .catch( err => res.status(400).json('Error' + err))
})

router.route('/update/:id').post(urlencodedParser, (req,res) => {

  User.findById(req.params.id)
    .then( user => {
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        user.name = req.body.name;
        user.surname = req.body.surname;
        user.username = req.body.username;
        user.password = hash;

        user.save()
          .then( () => res.json('user updated'))
          .catch( (err) => res.status(400).json('Error ' + err))
      })
    })
    .catch( err => res.status(400).json('Error ' + err))
})

module.exports = router;
