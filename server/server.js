require('./config/config')

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();


// parse application json
app.use(express.json())

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// habilitar la carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));

// Configuración global de rutas
app.use(require('./routes/index'));

mongoose.connect(process.env.URL_DB_CONEXION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true

}).then(res => {
    console.log('Base de datos ONLINE');
}).catch(err => {
    console.log('Error de conexión');
});


app.listen(process.env.PORT, () => {
    console.log('Server on port', process.env.PORT);
})