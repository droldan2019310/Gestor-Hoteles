'use strict'

var express = require('express');
var userController = require('../controllers/user.controller');
var mdAuth = require('../middlewares/authenticated');

var api = express.Router();

api.post ('/saveUser', userController.saveUser);
api.put('/updateUser', mdAuth.ensureAuth, userController.updateUser);
api.put('removeUser', mdAuth.ensureAuth, userController.removeUser);

module.exports = api;