//
function validaciones_correo(correo){

    let comprovaciones = 0;

    if( ( ( correo.includes('@') ) && ( correo.includes('.') ) ) ){
        //const str = 'Mozi@lla.com';
        let arroba = correo.indexOf('@');
        let punto = correo.indexOf('.');

        let direccion = correo.substr(0, arroba );
        let dominio =  correo.substr( arroba +1, punto - (arroba +1) );
        let extension =  correo.substr( punto +1 );

        // console.log(direccion.length)
        // console.log(dominio.length)
        // console.log(extension.length)
        
        

        if( direccion.length >  0 ){
        }else{
            comprovaciones++
        };

        if( dominio.length  >  0){
        }else{
            comprovaciones++
        };

        if( extension.length  >  0){
        }else{
            comprovaciones++
        };
    }else{
        comprovaciones++
    }
    
    return comprovaciones;
}

module.exports = {
    validaciones_correo,
}