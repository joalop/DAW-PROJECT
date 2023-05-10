const express = require('express')
const router = express.Router()

const bcryp = require('bcrypt');


// CONST POOL
const pool = require('../database/connection')

// FUNCIONES DB
const { todos_los_usuarios, buscar_usuario, buscar_email, registrar_usuario, } = require('./functions/functionsdb')

// FUNCIONES DB
const { validaciones_correo } = require('./functions/validaciones')
// ----------------------

// GET '/' INDEX
router.get('/', (req, res, next) => {
    res.render('templates/inicial.ejs', {})
});

// GET LOGIN
router.get('/login', (req, res, next) => {
    res.render('templates/login.ejs', { respuesta_usuario_login: "" })
});

// POST LOGIN
router.post('/login', (req, res, next) => {

    //console.log( req.body )

    
    // COMPROVANDO  EN LA PROMESA, SI EL USUARIO YA EXISTE, Devuelve en [0] True si el usuario existe y False si no, [1] la contrasenya encriptada
    try{
        buscar_usuario( pool, req.body.email, req.body.password )
        .then( response => {
            //console.log( 'Respuesta', response[0].contrasenya );
            console.log( 'Respuesta', response );

            if(response[0] == true){
                //Compara con contaseña encriptada
                bcryp.compare(req.body.password, response[1], ( error, response ) => {
                    try{
                        if( error ){ throw error }
                        if( response ){
                            // Ok
                            res.render( 'templates/inicial.ejs', {} );

                        }else{
                            res.render( 'templates/login', { respuesta_usuario_login: "Incorrect Password or Email" } );

                        }
                        
                    }catch( error){
                        console.log( error );

                    }
                });
            } else {
                res.render( 'templates/login', { respuesta_usuario_login: "Incorrect Password or Email" } );
            }

        });

    }catch(error){
        console.log(error)
    }

});

// GET REGISTER
router.get('/register', (req, res, next) => {
    
    let inconvenientes = "";

    res.render('templates/register.ejs', { inconvenientes: "" })
});

// POST REGISTER
router.post('/register', (req, res, next) => {
    console.log( req.body )
    // Recogiendo Variables
    let nombre = req.body.name;
    let apellido = req.body.lastnames;
    let correo = req.body.email;
    let contraseña = req.body.password1;
    let comprovacion_contraseña = req.body.password2;
    let inconvenientes = [];

    // comprobar valor recivido en la Validacion del correo
    console.log( validaciones_correo(correo) );

    //  Validaciones de Correo
    if( validaciones_correo(correo) > 0){
        inconvenientes.push( `The email is not valid Ej: address@domain.extension.` );
    }

    //  Validaciones de Contraseña
    if(contraseña != comprovacion_contraseña){
        inconvenientes.push( `Passwords are not the same.` );
    }
        // COMPROVANDO EN LA PROMESA, SI EL EMAIL YA EXISTE
        try{
            buscar_email( pool, correo )
            .then( response => {
                console.log( 'Email Encontrado', response ) //Devuelve True si el Email Ya existe y False si no Existe
                if(response == true){
                    //Email Encontrado
                    inconvenientes.push( `Mail already exists.` );
                } else {
                    //Email No Encontrado
                }

                // Reasignacion de Errores encontrados
                if( inconvenientes.length > 0 ){
                    res.render('templates/register.ejs', { inconvenientes: inconvenientes });

                }else{

                    //encriptar contraseña
                    bcryp.hash(contraseña, 10, (error, hash ) => {
                        try{
                            if(error){ throw error; }

                            registrar_usuario( pool, nombre, apellido, correo, hash, permiso = 2).then(
                                res.render('templates/users', {})
                            );
                        
                        }catch(error){
                        console.log( error );
                        } 
                    });
                }
            });
        }catch(error){
            console.log(error)
        }
});

// -----------------------------
// ------- OTHERS ROUTES -------
// -----------------------------

// GET ElemensDelay
router.get('/ElemensDelay', (req, res, next) => {

    const elementos = ['Elemento 1', 'Elemento 2', 'Elemento 3', 'Elemento 4'];
    res.render('./utils/example', { elementos: elementos });
    
});

// GET SlowTransition
router.get('/SlowTransition',(req, res, next) => {
    res.render('./utils/transition')
 });

 // GET LastPOsition

 router.get('/LastPosition',(req, res, next) => {
    res.render('./utils/lastpos')
 });


module.exports = router;