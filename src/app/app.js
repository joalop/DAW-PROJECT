const express = require('express')

const logger = require('morgan')
const dotenv = require('dotenv')

const path = require('path')
const fs = require('fs')
const os = require('os')


const app = express()


// Setters

// Set Views Ejs
app.set('views', path.join(__dirname,'../views'))
app.set('view engine','ejs')

// Set PORT
app.set('port', process.env.PORT || 3000)

// Middlewares

app.use( logger('dev') );
app.use( express.json() );

// Static Files q
// ----------------------------------------------------
app.use( express.static(path.join(__dirname,"../public")) )

// Comf Sesions


// Conf Multer

// Conf Connect-Flash



// Routes

app.get('/',(req, res, next) => {
res.send('Helle World')
});

app.get('/example', (req, res, next) => {

const elementos = ['Elemento 1', 'Elemento 2', 'Elemento 3', 'Elemento 4'];
res.render('example', { elementos: elementos });

});

// Listen Server

app.listen( app.get('port'), () => {
   console.log( `Server listen in port ${ app.get('port') }` );
});