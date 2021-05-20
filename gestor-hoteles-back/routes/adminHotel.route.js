'use strict'
var express = require('express');
var adminHotelController = require('../controller/AdminHotel.controller');
var mdAuth = require('../middlewares/authenticated');

var api = express.Router();
api.post('/saveUserOnlyAdmin/:id', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], userController.saveUserByAdmin);
api.get('/getUsers', userController.getUsers);
module.exports = api;