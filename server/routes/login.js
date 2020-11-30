const express = require('express');
const _ = require('underscore');
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { OAuth2Client } = require('google-auth-library');
const usuario = require('../models/usuario');
const client = new OAuth2Client(process.env.CLIENT_ID);

const app = express();


app.post('/login', (req, res) => {

    let body = req.body;
    Usuario.findOne({ email: body.email }, (err, userDb) => {

        if (err) {

            return res.status(500).json({
                ok: false,
                err
            });

        }

        if (!userDb) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: '[Usuario] o contraseña incorrectos'
                }
            });
        }

        if (!bcrypt.compareSync(body.password, userDb.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o [contraseña] incorrectos'
                }
            });

        }

        let hashJWT = {
            iss: 'issuer_claim',
            aud: 'audience_claim',
            iat: Math.floor(Date.now() / 1000) - 30,
            exp: Math.floor(Date.now() / 1000) + parseInt(process.env.CADUCIDAD_TOKEN),
            data: userDb
        }
        let token = jwt.sign(hashJWT, process.env.KEY_SECRET)
        res.json({
            ok: true,
            usuario: userDb,
            token
        });

    });

});

// Configuraciones de Google

function _gethashJWT(dataUser) {
    return {
        iss: 'issuer_claim',
        aud: 'audience_claim',
        iat: Math.floor(Date.now() / 1000) - 30,
        exp: Math.floor(Date.now() / 1000) + parseInt(process.env.CADUCIDAD_TOKEN),
        data: dataUser
    };

}

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID
    });
    const payload = ticket.getPayload();

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }

}



app.post('/google', async(req, res) => {

    let token = req.body.idtoken;

    let googleUser = await verify(token)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                err: 'ERRORES'
            })
        });

    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {


        if (err) {

            return res.status(500).json({
                ok: false,
                err
            });

        };

        if (usuarioDB) {

            if (usuarioDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Debe usar su autenticación normal'
                    }
                });
            } else {
                let hashJWT = _gethashJWT(usuarioDB);
                return res.json({
                    ok: true,
                    usuario: googleUser,
                    token: jwt.sign(hashJWT, process.env.KEY_SECRET)
                });
            }


        } else {

            // Si el usuario no existe en nuestra BD
            let usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = 'XD';

            usuario.save((err, usuarioDB) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                let hashJWT = _gethashJWT(usuarioDB);

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token: jwt.sign(hashJWT, process.env.KEY_SECRET)
                });
            });

        }

    })

});


module.exports = app