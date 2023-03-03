const sChat = require('../models/chat');

module.exports = function (io) {

  io.use( async (socket, next) => {
    let userId = socket.request._query['userId'];
    let userSocketId = socket.id;      
    next();   
  });


  let userList = []

  io.on('connection', (socket) => {
    console.log(`Connecté au client ${socket.id}`)
    io.emit('notification', { type: 'new_user', data: socket.id });

    // Listener sur la déconnexion
    socket.on('disconnect', () => {
      console.log(`user ${socket.id} disconnected`);
      io.emit('notification', { type: 'removed_user', data: socket.id });

      userList = userList.filter(user => user.id !== socket.id)
      io.emit('exit', userList);
    });

    socket.on('message', ({text, from}) => {
      io.emit('user', `${from}`);
      io.emit('message', `${text}`);
      console.log(from, text);
    });

    socket.on('private', ({text, to,from}) => {
      io.emit(to, `${from} : text ${text}`);
    });

    userList.push({id: socket.id, name: socket.id})
    io.emit('enter', userList);

    //socket.on('...', (msg) => {
    //});
  })

}