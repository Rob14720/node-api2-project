// implement your server here
const express = require('express');
const server = express();
const postRouter = require('./posts/posts-router')

server.use(express.json());

server.use('/api/posts', postRouter)

server.get('/', (req, res) => {
    res.status(200).json('Helllooo, I looove my girlfriennnnd!!!')
})

module.exports = server;
// require your posts router and connect it here
