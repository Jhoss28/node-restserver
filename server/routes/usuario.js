const express = require('express');
const Usuario = require('../models/usuario');
const app = express();
const _ = require('underscore');
const bcrypt = require('bcrypt');

app.get('/usuario', (req, res) => {

    let limite = Number(req.query.limite) || 6;
    let getPage = Number(req.query.page);
    let page = getPage > 0 ? ((getPage - 1) * limite) : 0;

    Usuario.find({ estado: true }, '-password')
        .skip(page)
        .limit(limite)
        .exec((err, userDB) => {
            if (err) {
                return res.status(400).json({
                    OK: false,
                    err: err
                })
            }
            Usuario.count({ estado: true }, (err, cont) => {
                res.json({
                    OK: true,
                    page: getPage,
                    limit: limite,
                    total: cont,
                    data: userDB

                })
            });

        })

});

app.post('/usuario', (req, res) => {

    let data = req.body;
    let usuario = new Usuario({
        nombre: data.nombre,
        email: data.email,
        password: bcrypt.hashSync(data.password, 10),
        img: data.img,
        role: data.role

    });


    usuario.save((err, userDB) => {
        if (err) {
            return res.status(400).json({
                OK: false,
                err: err
            })
        }
        res.json({
            OK: true,
            usuario: userDB
        })
    })

});

app.put('/usuario/:id', (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);


    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, userDB) => {
        if (err) {
            return res.status(400).json({
                OK: false,
                err: err
            })
        }
        res.json({
            OK: true,
            usuario: userDB
        })
    })

});

app.delete('/usuario/:id', (req, res) => {
    let id = req.params.id;
    let body = {
        estado: false
    }

    /* Usuario.findByIdAndRemove(id, (err, result) => {
        if (err) {
            return res.status(400).json({
                OK: false,
                err: err
            })
        }
        console.log(result)
        if (!result) {
            return res.status(400).json({
                OK: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            })
        }
        res.json({
            OK: true,
            usuario: 'Usuario borrado'
        })

    }) */


    Usuario.findByIdAndUpdate(id, body, { new: true }, (err, userDB) => {
        if (err) {
            return res.status(400).json({
                OK: false,
                err: err
            })
        }
        res.json({
            OK: true,
            usuario: userDB
        })
    })


});

module.exports = app;