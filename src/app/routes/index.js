const express = require('express')
const router = express.Router()

const bcryp = require('bcrypt');

// Login coments
let comments = "";


// CONST POOL
const pool = require('../database/connection')
// ----------------------
// FUNCIONES DB
const { todos_los_usuarios, saca_data_user, buscar_usuario, buscar_email, nom_permiso_usuario, registrar_usuario, } = require('./functions/functionsdb');
// ----------------------
// FUNCIONES DB
const { validaciones_correo } = require('./functions/validaciones');
// ----------------------
// FUNCIONES MIDDLEWARE
const { have_session } = require('./middleware/session');

// GET '/' INDEX
router.get('/', (req, res, next) => {
    res.render('templates/inicial.ejs', {})
});

// GET LOGIN
router.get('/login', (req, res, next) => {
    
    res.render('templates/login.ejs', { comments, respuesta_usuario_login: "", })
});

// POST LOGIN
router.post('/login', (req, res, next) => {
    // COMPROVANDO  EN LA PROMESA, SI EL USUARIO YA EXISTE, Devuelve en [0] True si el usuario existe y False si no, [1] la contrasenya encriptada
    try{
        buscar_usuario( pool, req.body.email, req.body.password )
        .then( response => {
            if(response[0] == true){
                //Compara con contaseña encriptada
                bcryp.compare(req.body.password, response[1], ( error, response ) => {
                    try{
                        if( error ){ throw error };
                        
                        if( response ){
                            // Ok

                            let user_profile = saca_data_user(pool, req.body.email)
                            user_profile.then( response => {

                                req.session.id_usuario = response[0].id_usuario;
                                req.session.nombre = response[0].nombre;
                                req.session.email = response[0].email;
                                req.session.permiso_id = response[0].permisos;

                                //console.log('Response: ', response);
                                //console.log('Response permiso: ', response[0].permisos );

                                let permiso_name = nom_permiso_usuario(pool, req.session.permiso_id);
                                permiso_name.then( ( permiso ) => {
                                    console.log('Response: ', permiso)
                                    //
                                    req.session.permiso_name = permiso[0].nombre;  // 'USER', 'ADMINISTRATOR'

                                    res.render( 'templates/dashboard.ejs', { user_name: req.session.nombre, user_email: req.session.email, user_permision: req.session.permiso_name } );
                                });
                            });

                        }else{
                            res.render( 'templates/login', { comments, respuesta_usuario_login: "Incorrect Password or Email" } );

                        };
                        
                    }catch( error){
                        console.log( error );

                    }
                });
            } else {
                res.render( 'templates/login', { comments, respuesta_usuario_login: "Incorrect Password or Email" } );
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


// GET DASHBOARD
router.get('/dashboard', have_session, (req, res, next) => {
    res.render( 'templates/dashboard.ejs', {
        user_name: req.session.nombre,
        user_email: req.session.email,
        user_permision: req.session.permiso_name,
    });
});

// GET ADMIN
router.get('/admin', have_session, (req, res, next) => {
    try{
        todos_los_usuarios(pool)
        .then( response2 => {
                //console.log(response2);

                res.render('templates/private/admin.ejs', {
                    user_name: req.session.nombre,
                    user_email: req.session.email,
                    user_permision: req.session.permiso_name,
                    usuarios:  response2,
                });
        });

    }catch( error ){
        console.log( error );
    }
        
});

// GET LOGOUT
router.get('/logout', have_session, (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.log('Error al destruir la sesión:', err);
      } else {
        res.redirect('/login');
      }
    });
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
    res.render('./utils/transition');
 });

 // GET LastPOsition

 router.get('/LastPosition',(req, res, next) => {
    res.render('./utils/lastpos')
 });


module.exports = router;