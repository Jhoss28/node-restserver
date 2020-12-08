const jwt = require('jsonwebtoken');

let virifyToken = (req, res, next) => {

    let token = req.get('authorization');

    jwt.verify(token, process.env.KEY_SECRET, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    name: 'JsonWebTokenError',
                    message: 'Token incorrecto'
                }
            })
        }

        req.usuario = decoded.data
        next();

    })
}

let virifyRole = (req, res, next) => {

    let role = req.usuario.role;

    if (role !== 'ADMIN_ROLE') {
        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es un administrador'
            }
        });

    }
    next();

}

let verifyTokenImg = (req, res, next) => {

    let token = req.query.token;


    jwt.verify(token, process.env.KEY_SECRET, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token incorrecto'
                }
            })
        }

        req.usuario = decoded.data
        next();
    });
}


module.exports = {
    virifyToken,
    virifyRole,
    verifyTokenImg
}