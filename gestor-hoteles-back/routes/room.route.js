'user strict'

var express = require('express');
var roomController = require('../controllers/room.controller');
var mdAuth = require('../middlewares/authenticated');

var connectMultiparty = require('connect-multiparty');
var mdUpload = connectMultiparty({ uploadDir: './uploads/users'});

var api = express.Router();

api.post('/saveRoom', [mdAuth.ensureAuth, mdAuth.ensureAuthAdminHotel] ,roomController.saveRoom); //Guardar una habitacino y agrear a hotel;
api.put('/:id/uploadImageRoom', [mdAuth.ensureAuth, mdUpload], roomController.uploadImageRoom);
api.get('/getImageRoom/:fileName', [ mdUpload], roomController.getImageRoom);
api.put('/updateRoom/:id', [mdAuth.ensureAuth, mdAuth.ensureAuthAdminHotel], roomController.updateRoom); //update de habitacion pero no de imagen
api.put('/removeRoom/:id', [mdAuth.ensureAuth, mdAuth.ensureAuthAdminHotel], roomController.removeRoom); //eliminar habitacion.




module.exports = api;