'user strict'

var express = require('express');
var adminHotelController = require('../controllers/adminHotel.controller');
var mdAuth = require('../middlewares/authenticated');


var api = express.Router();

api.post('/saveUserByAdmin', adminHotelController.saveUserAdmin); //Guardar un usuario con un role cualquiera.

module.exports = api;