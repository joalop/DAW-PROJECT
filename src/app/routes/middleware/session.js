

function have_session(req, res, next){

  if (req.session.nombre && req.session.email) { //Comprueba si existen valores de sesión
    // El usuario tiene session
    next();
  } else {
    // El usuario no tiene sesion
    res.render('templates/login.ejs', {comments: `If you want to log in, you need to log in`, respuesta_usuario_login: "",});
  }
}

function is_admin(req, res, next){

  if (req.session.permiso_id == 1) { //Comprueba si el usuario es admin
    // El usuario es admin
    next();
  } else {
    // El usuario no es admin
    res.render('templates/dashboard.ejs', { comments: `If you want to log in, you need Admin Access`, respuesta_usuario_login: "",});
  }
}

module.exports = { have_session, is_admin };