'use strict'

var express = require('express');
var userController = require('../controllers/user.controller');
var mdAuth = require('../middlewares/authenticated');

var connectMultiparty = require('connect-multiparty');
var mdUpload = connectMultiparty({ uploadDir: './uploads/users'});

var api = express.Router();

api.post ('/saveUser', userController.saveUser);
api.put('/updateUser/:id', mdAuth.ensureAuth, userController.updateUser);
api.put('removeUser', mdAuth.ensureAuth, userController.removeUser);

module.exports = api;