const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
require('../routes/usuario');

let roleValido = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{PATH} no es un role valido'
};

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es necesio']
    },
    password: {
        type: String,
        required: [true, 'La clave es obligatoria']
    },
    img: {
        type: String,
        required: false,
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: roleValido

    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }

});

usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
    //return { email: userObject.email, name: userObject.nombre };
}

usuarioSchema.plugin(uniqueValidator, {
    message: '{PATH} debe de ser unico'
});

module.exports = mongoose.model('Usuario', usuarioSchema);