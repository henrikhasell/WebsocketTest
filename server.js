const io = require('socket.io');
const express = require('express');

const app = express();
const http = app.listen(9090);

const ioServer = io(http);

ioServer.on('connection', async (socket) => {
  console.log('Connection at ' + (new Date()).getTime());

  socket.on('chat-message', (message) => {
    console.log(message);
    socket.emit('chat-message', message); 
  });

  socket.on('disconnect', () => {
    console.log('Disconnection at ' + (new Date()).getTime());
  });
});
