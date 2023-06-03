const express = require('express')
const router = express.Router()

const bcryp = require('bcrypt');

// Login coments
let comments = "";


// CONST POOL
const pool = require('../database/connection')
// ----------------------
// FUNCIONES DB
const { todos_los_usuarios, saca_data_user, saca_data_user_id, buscar_usuario,
    buscar_email, nom_permiso_usuario, registrar_usuario, del_user, update_user, } = require('./functions/functionsdb');
// ----------------------
// FUNCIONES DB
const { validaciones_correo } = require('./functions/validaciones');

// ----------------------
// FUNCIONES MIDDLEWARE
const { have_session, is_admin, } = require('./middleware/session');

// FUNCIONES NODEMAILER
const { email, } = require('../modules/nodemailer/nodemailer');

// VARIABLES GLOVALES
var contra_text_plana;

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
        contra_text_plana = req.body.password;
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

                                
                                req.session.nombre = response[0].nombre;
                                req.session.email = response[0].email;
                                req.session.permiso_id = response[0].permisos;
                                req.session.id_usuario = response[0].id_usuario;
                                
                                //console.log( req.session.id_usuario );

                                //console.log('Response: ', response);
                                //console.log('Response permiso: ', response[0].permisos );

                                let permiso_name = nom_permiso_usuario(pool, req.session.permiso_id);
                                permiso_name.then( ( permiso ) => {
                                    // console.log('Response: ', permiso)
                                    //
                                    req.session.permiso_name = permiso[0].nombre;  // 'USER', 'ADMINISTRATOR'

                                    res.render( 'templates/dashboard.ejs', { user_name: req.session.nombre, user_email: req.session.email, user_permision: req.session.permiso_name, id_user: req.session.id_usuario } );
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
    // console.log( req.body )
    
    // Recogiendo Variables
    let nombre = req.body.name;
    let apellido = req.body.lastnames;
    let correo = req.body.email;
    let contraseña = req.body.password1;
    let comprovacion_contraseña = req.body.password2;
    let inconvenientes = [];

    // comprobar valor recivido en la Validacion del correo
    // console.log( validaciones_correo(correo) );

    //  Validaciones de Correo
    if( validaciones_correo(correo) > 0){
        inconvenientes.push( `The email is not valid Ej: address@domain.extension.` );
    }

    //  Validaciones de Contraseña
    if(contraseña != comprovacion_contraseña){
        inconvenientes.push( `Passwords are not the same.` );
    }
    contra_text_plana = comprovacion_contraseña;
        // COMPROVANDO EN LA PROMESA, SI EL EMAIL YA EXISTE
        try{
            buscar_email( pool, correo )
            .then( response => {
                //console.log( 'Email Encontrado', response ) //Devuelve True si el Email Ya existe y False si no Existe
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

                            registrar_usuario( pool, nombre, apellido, correo, hash, permiso = 2).then( ( response ) => {
                                try{
                                    email(receiver = correo, subject = 'Delaibrary', content = `Thanks for Sign-up in Delaibrary <br> User: ${nombre} ${apellido} your team will thanks you `).then( ( response ) => {
                                        res.redirect('/login');
                                    });

                                }catch( error ){
                                    console.log( error );
                                    res.redirect('/login');
                                };
                            });
                        
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
    let comments = "";

    res.render( 'templates/dashboard.ejs', {
        user_name: req.session.nombre,
        user_email: req.session.email,
        user_permision: req.session.permiso_name,
        id_user: req.session.id_usuario,
        comments,
    });
});

// GET ADMIN
router.get('/admin', have_session, is_admin, (req, res, next) => {
    try{
        todos_los_usuarios(pool)
        .then( response2 => {
                // console.log(response2);

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
router.get('/logout', have_session, (req, res ) => {
    try{
        req.session.destroy((err) => {
            if (err) {
              console.log('Error al destruir la sesión:', err);
            } else {
              res.redirect('/login');
            }
          });

    }catch( error ){
        console.log( error );
        res.redirect('/dashboard');
    }

  });

  // - - - - - - - - - - - - - 
  // GET /INSERT_USER

router.post('/insert_user', have_session, is_admin, (req, res ) => {
    //console.log( req.body );
    //encriptar contraseña
    try{
        bcryp.hash( req.body.key4, 10, (error, hash ) => {
            try{
                registrar_usuario( pool, nombre = req.body.key1, apellido = req.body.key2, correo = req.body.key3, hash, permiso = 2)
                .then(
                    res.json(req.body)
                )
                .catch( error => {
                    console.log( error );
                    res.json(req.body);
                });
    
                }catch( error){
                    console.log( error );
                }
        });

    }catch( error ){
        console.log( error );
    }
});

// POST EDIT_USER
router.post('/edit_user', have_session, (req, res, next) => {
    console.log('Aqui?',req.body);

    saca_data_user_id(pool, req.body.user_id).then( ( response ) => {
        console.log( 'Aqui2?', response );
        res.render('templates/private/edit_user.ejs', {
            user_name: req.session.nombre,
            user_email: req.session.email,
            user_permision: req.session.permiso_name,
            passwd: contra_text_plana,
            user_data: response,
        });
    })
    .catch( error => {
        console.log( error );
    });
});

// POST/user_change_data
router.post('/user_change_data', have_session, ( req, res, next ) => {
    console.log( req.body );
    try{

        if( req.body.validez == "" || req.body.validez == undefined || req.body.validez == null ){
            // Sin vigencia
            if( req.body.contra == "" || req.body.contra == undefined ){
                // Sin contra y sin vigencia
                req.body.id, req.body.nom, req.body.ape, req.body.usu_chat, req.body.correo, req.body.perm,
    
                sql = `UPDATE usuarios set nombre = ?, apellidos = ?, usuario_chat = ?, email = ?, permisos = ? WHERE id_usuario = ?;`;
    
                update_user( pool, sql, [ String( req.body.nom ), String( req.body.ape ), String( req.body.usu_chat ), String( req.body.correo ),
                    parseInt( req.body.perm ), parseInt( req.body.id ) ]).then( ( reponse ) => {
                    res.json( req.body);
                });
            } else {
                // Con contra y sin vigencia
                req.body.id, req.body.nom, req.body.ape, req.body.usu_chat, req.body.correo, req.body.validez, req.body.perm,
    
                sql = `UPDATE usuarios set nombre = ?, apellidos = ?, usuario_chat = ?, email = ?, contrasenya = ?, permisos = ? WHERE id_usuario = ?;`;
    
                bcryp.hash( req.body.contra, 10, ( error, hash ) => {
    
                    update_user( pool, sql, [ String( req.body.nom ), String( req.body.ape ), String( req.body.usu_chat ), String( req.body.correo ),
                        String( hash ), parseInt( req.body.perm ), parseInt( req.body.id ) ])
                        .then( ( reponse ) => {
                        res.json( req.body);
                    });
                });
            };
    
        } else {
            // Con vigencia
            if( req.body.contra == "" || req.body.contra == undefined ){
                // Sin contra y con vigencia
                req.body.id, req.body.nom, req.body.ape, req.body.usu_chat, req.body.correo, req.body.validez, req.body.perm,
    
                sql = `UPDATE usuarios set nombre = ?, apellidos = ?, usuario_chat = ?, email = ?, permisos = ?, vigencia = ? WHERE id_usuario = ?;`;
    
                update_user( pool, sql, [ String( req.body.nom ), String( req.body.ape ), String( req.body.usu_chat ), String( req.body.correo ),
                    parseInt( req.body.perm ), req.body.validez, parseInt( req.body.id ) ]).then( ( reponse ) => {
                    res.json( req.body);
                });
    
            } else {
                // Con contra y con vigencia
                req.body.id, req.body.nom, req.body.ape, req.body.usu_chat, req.body.contra, req.body.correo, req.body.validez, req.body.perm,
    
                bcryp.hash( req.body.contra, 10, ( error, hash ) => {
    
                    sql = `UPDATE usuarios set nombre = ?, apellidos = ?, usuario_chat = ?, email = ?, contrasenya = ?, permisos = ?, vigencia = ? WHERE id_usuario = ?;`;
        
                    update_user( pool, sql, [ String( req.body.nom ), String( req.body.ape ), String( req.body.usu_chat ), String( req.body.correo ),
                       String( hash ), parseInt( req.body.perm ), req.body.validez, parseInt( req.body.id ) ]).then( ( reponse ) => {
                        res.json( req.body);
                    });
                });
            };
        };

    }catch( error ){
        console.log( error );
        res.json( req.body);
    }

});

// GET DELETE_USER
router.post('/del_user', have_session, is_admin, ( req, res ) => {
    //console.log( req.body );
    del_user(pool,req.body.user).then(
        res.json( req.body )
    )
    .catch( error => {
        console.log( error );
        res.json( req.body );
    });
    
});


// -----------------------------
// ------ FORAIGN MODULES ------
// -----------------------------


router.get('/draw_canvas', have_session, (req, res, next) => {
    res.render('templates/modules/draw-canvas/draw-canvas.ejs', { user_name: req.session.nombre,
        user_email: req.session.email,
        user_permision: req.session.permiso_name, });
});

// ----------------------------
// --------- CHATTING ---------
// ----------------------------

router.get('/chatting', have_session, (req, res, next) => {
res.render('templates/chatting.ejs', { user_name: req.session.nombre,
    user_email: req.session.email,
    user_permision: req.session.permiso_name, })
});

// -------------------------
// --------- EMAIL ---------
// -------------------------
router.get('/email', have_session, (req, res, next) => {

    todos_los_usuarios( pool ).then( ( response ) => {
        res.render('templates/email.ejs',  { user_name: req.session.nombre,
            user_email: req.session.email,
            user_permision: req.session.permiso_name, usuarios: response});
    });
    
});

router.post('/email', have_session, ( req, res, next) => {
console.log( req.body );
try{
    console.log( req.body.writed );
    console.log( req.body.email );
    console.log( req.body.subject );
    console.log( req.body.content );

    if(req.body.writed == ""){
        email( receiver = req.body.email , subject = req.body.subject, content = req.body.content).then( ( response ) => {
            console.log(' Succesfull email send by req.body.email');
            res.redirect('/email');
        });
    }else{
        email( receiver = req.body.email , subject = req.body.subject, content = req.body.content).then( ( response ) => {
            console.log(' Succesfull email send by req.body.writed');
            res.redirect('/email');
        });
    }

}catch( error ){
    console.log( error );
    res.redirect('/email');
};


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