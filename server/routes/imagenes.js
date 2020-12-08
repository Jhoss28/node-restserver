const { verify } = require('crypto');
const express = require('express');
const fs = require('fs');
const path = require('path');
const { verifyTokenImg } = require('../middlewares/autentication')



let app = express();

app.get('/imagen/:tipo/:img', verifyTokenImg, (req, res) => {

    let tipo = req.params.tipo;
    let nombreImagen = req.params.img;

    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);

    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        let pathNotImagen = path.resolve(__dirname, '../assets/not-imagen.png');
        res.sendFile(pathNotImagen);
    }



});

module.exports = app;