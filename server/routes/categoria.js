const express = require('express');
const app = express();

const Categoria = require('../models/categoria');
const { virifyToken, virifyRole } = require('../middlewares/autentication');

app.get('/categoria', virifyToken, (req, res) => {

    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categoriaDB) => {
            if (err) {
                return res.status(400).json({
                    OK: false,
                    err: err
                })
            }

            return res.json({
                OK: true,
                data: categoriaDB
            });
        });

});

app.get('/categoria/:id', virifyToken, (req, res) => {

    id = req.params.id;

    Categoria.findById(id)
        .populate('usuario', 'nombre email')
        .exec((err, categoriaDB) => {

            if (err) {
                return res.status(500).json({
                    OK: false,
                    err: err
                })
            }

            if (!categoriaDB) {
                return res.status(400).json({
                    OK: false,
                    err: {
                        message: 'No se encontro la categoría'
                    }
                })
            }


            return res.json({
                OK: true,
                data: categoriaDB
            });
        });
});

app.post('/categoria', virifyToken, (req, res) => {

    let data = req.body;
    let categoria = new Categoria({
        descripcion: data.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                OK: false,
                err: err
            })
        }
        res.json({
            OK: true,
            categoria: categoriaDB
        });
    });

});

app.put('/categoria/:id', virifyToken, (req, res) => {

    let id = req.params.id;
    let body = {
        descripcion: req.body.descripcion,
        usuario: req.usuario._id
    };


    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                OK: false,
                err: err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                OK: false,
                err: {
                    message: 'La categoría no se encuentra'
                }
            });
        }

        res.json({
            OK: true,
            categoria: categoriaDB
        });
    });

});

app.delete('/categoria/:id', [virifyToken, virifyRole], (req, res) => {

    let id = req.params.id;
    Categoria.findByIdAndRemove(id, (err, result) => {
        if (err) {
            return res.status(500).json({
                OK: false,
                err: err
            })
        }

        if (!result) {
            return res.status(400).json({
                OK: false,
                err: {
                    message: 'Categoría no encontrado'
                }
            })
        }
        res.json({
            OK: true,
            usuario: 'Categoría borrado'
        })
    })

});

module.exports = app;