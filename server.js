const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, { cookie: false });

const port = process.env.PORT || 5000;

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });

io.on('connection', socket => {
  socket.on('message', ({name, message}) => {
    io.emit('message', { name, message })
  })

  socket.on('disconnect', () => {
    console.log('disconnected');
  })
});

app.use(cors());
app.use(express.json());

const userRouter = require('./routes/users.js');
const postRouter = require('./routes/posts.js');

app.use('/users', userRouter);
app.use('/posts', postRouter);

http.listen(port, () => {
  console.log('server running on port', port);
})
