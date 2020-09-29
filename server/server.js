require('./config/config')
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.set('port', process.env.PORT);

//app.use(express.json())
//app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded());
app.use(bodyParser.json())

app.get('/usuario', (req, res) => {
    res.json('Petición GET')
});

app.post('/usuario', (req, res) => {

    let data = req.body;
    if (data.nombre === undefined) {
        res.status(400).json({
            ok: false,
            message: 'El nombre es necesario.'
        })
    } else {
        res.json(data)
    }
});

app.put('/usuario/:id', (req, res) => {
    let id = req.params.id;
    res.json('Petición PUT ' + id)
});

app.delete('/usuario/:id', (req, res) => {
    let id = req.params.id;
    res.json('Petición DELETE ' + id)
});

app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
})