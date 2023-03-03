require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const sChat = require('./models/chat');

// export one function that gets called once as the server is being initialized
module.exports = function (app, server) {

    mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_URL}/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    { useNewUrlParser: true,
      useUnifiedTopology: true })
    .then(() => console.log('DB is OK'))
    .catch(() => console.log('DB failed'));

    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
        res.setHeader('Access-Control-Allow-Methods', '*');
        next();
    });

    app.use(express.json());

    const io = require('socket.io')(server, {
        cors: {
            origin: "http://127.0.0.1:5500",
            methods: ["GET", "POST"]
        }
    })
   
    require('./socket/chat')(io);

    app.use(function (req, res, next) { req.io = io; next(); });

    app.get('/chat', (req, res, next) => {
        sChat.find()
    .then(chats => res.status(200).json(chats))
    .catch(error => res.status(400).json({ error }));
    })

    app.get('/test', (req, res, next) => {
    
    })

    app.post('/chat/create', (req, res, next) => {

        const chat = new sChat({...req.body});
        chat.save().then(() => {
          res.status(201).json({
            message: 'Chat enregistrée'
          })
        }).catch((error) => {
          res.status(400).json({error})
        })
    })
}
