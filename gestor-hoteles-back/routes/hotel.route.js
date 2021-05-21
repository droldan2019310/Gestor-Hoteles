'user strict'

var express = require('express');
var hotelController = require('../controllers/hotel.controller');
var mdAuth = require('../middlewares/authenticated');

var connectMultiparty = require('connect-multiparty');
var mdUpload = connectMultiparty({ uploadDir: './uploads/users'});

var api = express.Router();

api.post('/saveHotel',[mdAuth.ensureAuth, mdAuth.ensureAuthAdmin],hotelController.saveHotel); //Guardar un hotel.
api.put('/:id/uploadImageHotel', [mdAuth.ensureAuth, mdUpload], hotelController.uploadImageHotel);
api.put('/:id/setUserHotel',[mdAuth.ensureAuth, mdAuth.ensureAuthAdmin],mdAuth.ensureAuth, hotelController.setUserHotel);
api.put('/:id/setFeatureHotel', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin],mdAuth.ensureAuth, hotelController.setFeatureHotel);



module.exports = api;