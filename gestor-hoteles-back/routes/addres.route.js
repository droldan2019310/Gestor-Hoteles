'user strict'

var express = require('express');
var addresController = require('../controllers/addres.controller');
var mdAuth = require('../middlewares/authenticated');

var api = express.Router();

api.post('/saveAddres',[mdAuth.ensureAuth, mdAuth.ensureAuthAdmin],addresController.saveAddres); //Guardar una direccion
api.get('/getAddres', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], addresController.getAddres); //Obtener todas las direcciones.



module.exports = api;