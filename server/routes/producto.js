const express = require('express');
const app = express();

const Producto = require('../models/producto');
const { virifyToken } = require('../middlewares/autentication');


app.get('/producto', virifyToken, (req, res) => {

    let limite = Number(req.query.limite) || 6;
    let getPage = Number(req.query.page) || 0;
    let page = getPage > 0 ? ((getPage - 1) * limite) : 0;

    Producto.find({ disponible: true })
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .skip(page)
        .limit(limite)
        .exec((err, productoDB) => {

            if (err) {
                return res.status(500).json({
                    OK: false,
                    err: err
                });
            }

            Producto.countDocuments({ disponible: true }, (err, cont) => {

                if (err) {
                    return res.status(500).json({
                        OK: false,
                        err: err
                    });
                }

                res.json({
                    OK: true,
                    page: getPage,
                    limit: limite,
                    total: cont,
                    data: productoDB
                });
            });

        });

});

app.get('/producto/:id', virifyToken, (req, res) => {

    id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {

            if (err) {
                return res.status(500).json({
                    OK: false,
                    err: err
                })
            }
            if (!productoDB) {
                return res.status(400).json({
                    OK: false,
                    err: {
                        message: 'No se encontro el producto'
                    }
                })
            }


            return res.json({
                OK: true,
                data: productoDB
            });
        });
});

app.post('/producto', virifyToken, (req, res) => {

    let data = req.body;
    let producto = new Producto({
        nombre: data.nombre,
        precioUni: data.precioUni,
        descripcion: data.descripcion,
        disponible: true,
        categoria: data.categoria,
        usuario: req.usuario._id,

    });

    producto.save((err, productoDB) => {

        if (err) {
            return res.status(500).json({
                OK: false,
                err: err
            })
        }

        res.status(201).json({
            OK: true,
            producto: productoDB
        });
    });

});

app.put('/producto/:id', virifyToken, (req, res) => {

    let id = req.params.id;
    let body = {
        nombre: req.body.nombre,
        precioUni: req.body.precioUni,
        descripcion: req.body.descripcion,
        disponible: true,
        categoria: req.body.categoria,
        usuario: req.usuario._id,
    };


    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                OK: false,
                err: err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                OK: false,
                err: {
                    message: 'El producto no se encuentra'
                }
            });
        }

        res.json({
            OK: true,
            producto: productoDB
        });
    });

});

app.delete('/producto/:id', virifyToken, (req, res) => {

    let id = req.params.id;

    let body = {
        disponible: false
    }

    Producto.findByIdAndUpdate(id, body, { new: true }, (err, productoDB) => {

        if (err) {
            return res.status(400).json({
                OK: false,
                err: err
            })
        }

        if (!productoDB) {
            return res.status(400).json({
                OK: false,
                err: {
                    message: 'El producto no se encuentra'
                }
            });
        }

        res.json({
            OK: true,
            producto: productoDB
        })
    })

});


// Buscar Producto

app.get('/producto/buscar/:termino', virifyToken, (req, res) => {

    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');
    Producto.find({ nombre: regex })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {

            if (err) {
                return res.status(500).json({
                    OK: false,
                    err: err
                });
            }

            if (!productoDB) {

                return res.status(400).json({
                    OK: false,
                    err: {
                        message: 'No se encontraron resutado de su busqueda'
                    }
                })

            }

            return res.json({
                OK: true,
                producto: productoDB

            })

        });

});

module.exports = app;