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
  Vencimiento del token 1 Hora
**********************************/

process.env.CADUCIDAD_TOKEN = 3600

/**********************************
  key secret  JWT 
**********************************/

process.env.KEY_SECRET = process.env.KEY_SECRET || 'YOUR_SECRET_KEY_01'

/**********************************
  Base de datos
**********************************/

let urlConexion;

if (process.env.NODE_ENV === 'dev') {
    urlConexion = 'mongodb://localhost:27017/cafe';
    //urlConexion = 'mongodb+srv://root28:root28@cluster0.jibtu.mongodb.net/cafe';
} else {
    urlConexion = process.env.MONGO_URI;
}
process.env.URL_DB_CONEXION = urlConexion;

/**********************************
  Google Client ID
**********************************/

process.env.CLIENT_ID = process.env.CLIENT_ID || '361226657318-24g2r7la4m9foble6mepm1ejqaifod9r.apps.googleusercontent.com';