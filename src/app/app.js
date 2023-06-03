// Express packges no built-in
const express = require('express');
const logger = require('morgan');

const socketIO = require('socket.io')

const cookieParser = require('cookie-parser');

const session = require('express-session');
const sesions_mysql = require('express-mysql-session')(session);

const favicon = require('serve-favicon');

//const multer = require('multer')

// packages built-in
const path = require('path');
const fs = require('fs');
const os = require('os');

//MYSQL2/PROMISES
const mysql = require('./database/connection')

// ROUTES FILES
const index_routes = require('./routes/index')

// ENVIROMENT .env
// const dotenv = require('dotenv')
// dotenv.config({ path: path.join(__dirname,'./.env') })

// CARGED EXPRESS()
const app = express()



// SETTERS

// Set Views Ejs
app.set('views', path.join(__dirname,'../views'))
app.set('view engine','ejs')
// ----------------------------------------------------

// Set PORT
app.set('port', process.env.PORT || 3000)

// MIDDLEWARES

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static Files
app.use( express.static(path.join(__dirname,"../public")) )
// ----------------------------------------------------

// Favicon
app.use(favicon(path.join(__dirname, '../public/images/icons/Untitled-Design.ico'), { maxAge: 86400000 }));
// ----------------------------------------------------

// Comf Sesions
// app.use( sessions({
//    secret: '23@.net',
//    resave: true,
//    saveUninitialized: true,
// }))
const options = {
   host: 'bgeewmpmykr14vhqeknc-mysql.services.clever-cloud.com',
   port: 3306,
   user: 'ufmyz6jebp6lhp14',
   password: 'jYjtyXwOjzpoGvJFQw5E',
   database: 'bgeewmpmykr14vhqeknc',
};

const sessionStore = new sesions_mysql( options );
//
app.use( session({
   key: 'cookie_user',
   secret: '23@.net',
   store: sessionStore,
   resave: false,
   saveUninitialized: false,
}) )

// Conf Multer

// Conf Connect-Flash



// ROUTES

// MIDDLEWARE TO GET INDEX ROUTES
app.use('/', index_routes);

app.get('/mysql', (req, res, next) => {

   console.log('hola')
   mysql

   res.redirect('/')
});

// Configuración de la ruta 404
app.use( (req, res, next) => {

   if( req.session.permiso_name ){
      res.status(404).render('templates/not-found.ejs', { session: 'si', user_name: req.session.nombre,
      user_email: req.session.email,
      user_permision: req.session.permiso_name, });

   } else {
      res.status(404).render('templates/not-found.ejs', { session: 'no' });
   }

   
 });


// Listen Server
//app.listen( app.get('port'), () => { console.log(`Server listen on port: ${app.get('port')}`)} );
const server = app.listen( app.get('port'), () => {
   console.log(`Server listen on port: ${app.get('port')}`) }
);

// 00º websockets conf, the module need a server conection
const io = socketIO(server);

// websokets " events "

// 01º Websocket listen conections
io.on('connection', (socket) => {
   console.log('new conection', socket.id)

   // 3º Listen a event
   socket.on('chat:sending', (data) => {

       // Now we have two options
       // send message to all users included me
       io.sockets.emit('chat:sending', data) // this is a server event, and we can use the same name

       // send message to all users without me
       // socket.broadcast.emit('chat:sending', data)
   })

   socket.on('', () => {

   });
});