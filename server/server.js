require('./config/config')

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

app.set('port', process.env.PORT);

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));

app.use(require('../server/routes/usuario'));
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


app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
})