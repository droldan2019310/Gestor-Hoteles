'user strict'

var express = require('express');
var roomController = require('../controllers/room.controller');
var mdAuth = require('../middlewares/authenticated');

var connectMultiparty = require('connect-multiparty');
var mdUpload = connectMultiparty({ uploadDir: './uploads/users'});

var api = express.Router();

api.put('/:id/uploadImageRoom', [mdAuth.ensureAuth, mdUpload], roomController.uploadImageRoom);
api.get('/getImageRoom/:fileName', [ mdUpload], roomController.getImageRoom);

api.put('/:idU/updateRoom/:idC', [mdAuth.ensureAuth, mdAuth.ensureAuthAdminHotel], roomController.updateRoom);
api.put('/:idU/removeRoom/:idC', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], roomController.removeRoom); //eliminar habitacion.

api.get('/:idU/getRoomByHotel', [mdAuth.ensureAuth, mdAuth.ensureAuthAdminHotel], roomController.getRoomByHotel);
api.get('/getHotelsRooms', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], roomController.getHotelsRooms); // obtener todos los hoteles con todas las habitaciones

api.put('/:idU/updateRoomClient/:idC', [mdAuth.ensureAuth], roomController.updateRoom);


module.exports = api;