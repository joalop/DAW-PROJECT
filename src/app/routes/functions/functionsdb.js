
 
 // FUNCIÓN para buscar todos los usuarios
 async function todos_los_usuarios(pool){
        const [ users ] = await pool.query('SELECT * FROM usuarios;');
    
        console.log( users )
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
    return encontrado
}

// FUNCIONES para registrar un usuario con fecha actual
// FUNCIÓN para sacar la fecha actual en formato americano
function hora_actual_formato_americano(){
    let fecha = new Date(); // fecha y hora actuales
    let anio = fecha.getFullYear(); // obtener el año
    let mes = fecha.getMonth() + 1; // obtener el mes (de 0 a 11)
    let dia = fecha.getDate(); // obtener el día del mes
    let fechaTexto = anio + '-' + ( mes < 10 ? '0' : '') + mes + '-' + (dia < 10 ? '0' : '') + dia;
    return fechaTexto; // muestra la fecha en formato YYYY-MM-DD
}
// FUNCIÓN asyncrona para registra un usuario en la base de datos
async function registrar_usuario(pool, nombre, apellido, correo, contraseña, permiso, hora_actual = hora_actual_formato_americano()){
    const [ new_users ] = await pool.query(`insert into usuarios ( id_usuario, nombre, apellidos, usuario_chat, email, contrasenya, permisos, fecha_creacion, vigencia )
    values ( null, ?, ?, ?, ?, ?, ?, ?, null);`,[ String(nombre), String(apellido), String(nombre), String(correo), String(contraseña), permiso, String(hora_actual) ]);
}
    


module.exports = {
    todos_los_usuarios,
    buscar_usuario,
    buscar_email,
    registrar_usuario,
}