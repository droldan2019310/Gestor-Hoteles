'use strict'

var express = require('express');
const { updateUserAdmin } = require('../controllers/admin.controller');
var userController = require('../controllers/user.controller');

var api = express.Router();

api.post ('/saveUser', userController.saveUser);
api.post('/pruebaController', userController.pruebaController);
api.post('/login', userController.login);
api.get('/getUsers', userController.getUsers); 
api.get('/getUser', userController.getUser);
api.put('/updateUser', userController.updateUser);
api.put('removeUser', userController.removeUser);

module.exports = api;