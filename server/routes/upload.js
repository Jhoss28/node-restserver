const e = require('express');
const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const fs = require('fs');
const path = require('path');

// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;

    // Validar tipo

    let tiposValidos = ['productos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) <= -1) {

        return res.status(400).json({
            ok: false,
            err: {
                message: 'No es tipo valido'
            }
        });
    }

    if (!req.files || Object.keys(req.files).length === 0) {

        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningun archivo'
            }
        });
    }

    let archivo = req.files.archivo;
    let arrArchivo = archivo.name.split('.');
    let extension = arrArchivo[arrArchivo.length - 1];


    // Extenciones permitidas

    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extension) <= -1) {

        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son ' + extensionesValidas.join(',')
            }
        });
    }

    // Cambiar nombre del archivo
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`

    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivo);
        } else {
            imagenProducto(id, res, nombreArchivo);
        }
    });

});


function imagenUsuario(id, res, nombreArchivo) {

    Usuario.findById(id, (err, usuarioDB) => {

        if (err) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            });
        }

        borraArchivo(usuarioDB.img, 'usuarios');

        usuarioDB.img = nombreArchivo;
        usuarioDB.save((err, usuarioSave) => {


            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            return res.json({
                ok: true,
                usuario: usuarioSave,
                imagen: nombreArchivo
            })

        })
    })
}

function imagenProducto(id, res, nombreArchivo) {

    Producto.findById(id, (err, productoDB) => {

        if (err) {
            borraArchivo(nombreArchivo, 'productos');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            borraArchivo(nombreArchivo, 'productos');
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Productos no existe'
                }
            });
        }




        borraArchivo(productoDB.img, 'productos');

        //productoDB.img = nombreArchivo;
        productoDB.img = nombreArchivo
        console.log(productoDB.imagen);
        console.log(nombreArchivo);

        productoDB.save((err, productoSave) => {


            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            return res.json({
                ok: true,
                producto: productoSave,
                imagen: nombreArchivo
            })

        })
    })


}

function borraArchivo(nombreImagen, tipo) {
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);

    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app