// Express packges no built-in
const express = require('express');
const logger = require('morgan');

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

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(logger('dev'));


app.use(cookieParser());
// ----------------------------------------------------

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
   host: 'localhost',
   port: 3306,
   user: 'root',
   password: 'root',
   database: 'managebd',
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


// Listen Server
app.listen( app.get('port'), () => {
   console.log( `Server listen in port ${ app.get('port') }` );
});