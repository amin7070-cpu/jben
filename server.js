
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('set username', (username) => {
    socket.username = username;
    io.emit('user notification', `${username} joined the chat`);
  });

  socket.on('chat message', (msg) => {
    io.emit('chat message', { username: socket.username, message: msg });
  });

  socket.on('typing', (isTyping) => {
    socket.broadcast.emit('typing', { username: socket.username, isTyping });
  });

  socket.on('disconnect', () => {
    io.emit('user notification', `${socket.username} left the chat`);
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
