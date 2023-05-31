const { pool } = require("../../database/connection");

 
 // FUNCIÓN para buscar todos los usuarios
 async function todos_los_usuarios(pool){
        const [ users ] = await pool.query('SELECT id_usuario, nombre, apellidos, usuario_chat, email, contrasenya, permisos, DATE_FORMAT(fecha_creacion, "%Y-%m-%d") AS fecha_formateada, DATE_FORMAT(vigencia, "%Y-%m-%d") AS vigencia_formateada FROM usuarios;');
        return users;
}

 // FUNCIÓN para Devolver datos de un Usuario por el email
 async function saca_data_user(pool, email){
    const [ users ] = await pool.query('SELECT * FROM usuarios WHERE email = ? ',[ email ]);
    return users;
}

 // FUNCIÓN para Devolver datos de un Usuario por la id
 async function saca_data_user_id(pool, id){
    const [ users ] = await pool.query('SELECT * FROM usuarios WHERE id_usuario = ?; ',[ id ]);
    return users;
}

// FUNCIÓN para Buscar un usuario en la tabla usuarios
async function buscar_usuario( pool, email, contraseña ){
    let encontrado;
    //const [ users ] = await pool.query('SELECT * FROM usuarios WHERE email = ? and contrasenya = ?',[ email, contraseña ]);
    const [ users ] = await pool.query('SELECT * FROM usuarios WHERE email = ? ',[ email ]);
    // console.log( users )
    // console.log( users.length ) //: #1

    if(users.length >= 1){
        encontrado = true;
        return [ encontrado, users[0].contrasenya ];

    }else{
        encontrado = false;
        return [ encontrado ];

    }
    
    //return users;
}

// FUNCIÓN para Buscar un email en la tabla usuarios
async function buscar_email( pool, email ){
    let encontrado;
    const [ users ] = await pool.query('SELECT * FROM usuarios WHERE email = ? ',[ email ]);
    //console.log( users )
    // console.log( users.length ) //: #1

    if(users.length >= 1){
        encontrado = true;
    }else{
        encontrado = false;
    }
    return encontrado;
}

// Funcion para averiguar nombre del permiso de un usuario
async function nom_permiso_usuario(pool, permiso_usuario){
    const [ permisos ] = await pool.query(`select pu.nombre
    from usuarios u, permisos_usuarios pu
    where u.permisos = pu.id_permiso_usuario and pu.id_permiso_usuario = ? ;`,[ permiso_usuario ]);
    return permisos;
}


// FUNCIONES para registrar un usuario con fecha actual

// FUNCIÓN para sacar la fecha actual en formato americano
function hora_actual_formato_americano(){
    let fecha = new Date(); // fecha y hora actuales
    let anio = fecha.getFullYear(); // obtener el año
    let mes = fecha.getMonth() + 1; // obtener el mes (de 0 a 11)
    let dia = fecha.getDate(); // obtener el día del mes
    let fechaTexto = anio + '-' + ( mes < 10 ? '0' : '') + mes + '-' + (dia < 10 ? '0' : '') + dia;
    return fechaTexto; // Fecha en formato YYYY-MM-DD
}

// FUNCIÓN asyncrona para registra un usuario en la base de datos
async function registrar_usuario( pool, nombre, apellido, correo, contraseña, permiso, hora_actual = hora_actual_formato_americano()){
    const [ new_users ] = await pool.query(`insert into usuarios ( id_usuario, nombre, apellidos, usuario_chat, email, contrasenya, permisos, fecha_creacion, vigencia )
    values ( null, ?, ?, ?, ?, ?, ?, ?, null);`,[ String(nombre), String(apellido), String(nombre), String(correo), String(contraseña), permiso, String(hora_actual) ]);
}

// FUNCIÓN asyncrona para borrar un usuario
async function del_user(pool, id){
    const [ del ] = await pool.query(`DELETE FROM usuarios WHERE id_usuario = ?;`, [id]);
}

// FUNCIÓN para Actualizar un usuario "ADMIN"
async function update_user( pool, sql, array_user ){
    const [ new_data ] = await pool.query( sql, array_user );
}


module.exports = {
    todos_los_usuarios,
    saca_data_user,
    saca_data_user_id,
    buscar_usuario,
    buscar_email,
    nom_permiso_usuario,
    registrar_usuario,
    del_user,
    update_user,
}