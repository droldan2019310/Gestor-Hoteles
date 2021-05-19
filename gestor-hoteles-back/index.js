'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = 3800;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/Gestor-Hoteles', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=>{
        console.log('Conectado a BD');
        app.listen(port, ()=>{
            console.log('Servidor de express corriendo')
        })
    })
    .catch((err)=>console.log('Error al conectarse a la DB', err))