/****** 
 * Puerto
 * 
 */

process.env.PORT = process.env.PORT || 3000;


/**********************************
  Entorno
**********************************/
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

/**********************************
  Base de datos
**********************************/

let urlConexion;

if (process.env.NODE_ENV === 'dev') {
    urlConexion = 'mongodb://localhost:27017/cafe';
} else {
    urlConexion = process.env.MONGO_URI;
}

process.env.URL_DB_CONEXION = urlConexion;