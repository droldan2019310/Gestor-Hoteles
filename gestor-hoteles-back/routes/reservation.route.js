'user strict'

var express = require('express');
var reservationController = require('../controllers/reservation.controller');
var mdAuth = require('../middlewares/authenticated');

var api = express.Router();

api.post('/saveReservation/:idU/:idH/:idR',mdAuth.ensureAuth, reservationController.saveReservation); //Agregar reservación. (aplicar mecanismo para que takeRoom +1 and availableRoom-1)
api.put('/updateReservation/:id',mdAuth.ensureAuth, reservationController.updateReservation); //Actualizar todos los datos reservación menos objectId
api.put('/removeReserv/:id',mdAuth.ensureAuth, reservationController.removeReserv); //Eliminar la reservación

api.post('/availableRoom/:idH/:idR',mdAuth.ensureAuth, reservationController.availableRoom); //Cambiar estado (que se ejecute cada vez que hagan reservación).

api.put('/cancerlarRevserv/:id',mdAuth.ensureAuth, reservationController.cancerlarRevserv); //Cancelar reservación.(aplicar mecanismo para que takeRoom-1 and availableRoom+1)

api.get('/countReserv', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], reservationController.countReserv); //obtener todos los user. Opcion habil solo para admin.
api.put('/reservsByHotel/:id',mdAuth.ensureAuth, reservationController.reservsByHotel); //Eliminar la reservación



module.exports = api;

