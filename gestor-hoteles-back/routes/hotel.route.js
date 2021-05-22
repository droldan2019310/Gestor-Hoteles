'user strict'

var express = require('express');
var hotelController = require('../controllers/hotel.controller');
var mdAuth = require('../middlewares/authenticated');

var connectMultiparty = require('connect-multiparty');
var mdUpload = connectMultiparty({ uploadDir: './uploads/users'});

var api = express.Router();

api.post('/saveHotel',[mdAuth.ensureAuth, mdAuth.ensureAuthAdmin],hotelController.saveHotel); //Guardar un hotel.
api.put('/updateHotel/:id',[mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], hotelController.updateHotel); //Actualizar todos los datos de un hotel
api.put('/removeHotel/:id',[mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], hotelController.removeHotel);

api.put('/:id/uploadImageHotel', [mdAuth.ensureAuth, mdUpload], hotelController.uploadImageHotel); //Agregar o actualizar imagenes de un hotel.
api.get('/getImage/:fileName', [ mdUpload], hotelController.getImage);

api.put('/:id/setUserHotel',[mdAuth.ensureAuth, mdAuth.ensureAuthAdmin],mdAuth.ensureAuth, hotelController.setUserHotel); // Agregar administrador al hotel.
api.put('/:id/setFeatureHotel', [mdAuth.ensureAuth, mdAuth.ensureAuthAdminHotel],mdAuth.ensureAuth, hotelController.setFeatureHotel); //Agregar servicios a un hotel.
api.put('/:id/setRoomHotel', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin],mdAuth.ensureAuth, hotelController.setRoomHotel); //Agregar servicios a un hotel.
api.put('/:id/setRoomHotelAdmin', [mdAuth.ensureAuth, mdAuth.ensureAuthAdminHotel],hotelController.setRoomHotel); //Agregar servicios a un hotel.

api.put('/findUserByHotel/:idU', [mdAuth.ensureAuth, mdAuth.ensureAuthAdminHotel],mdAuth.ensureAuth, hotelController.findUserByHotel); //Agregar servicios a un hotel.




module.exports = api;