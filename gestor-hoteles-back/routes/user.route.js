'user strict'

var express = require('express');
var userController = require('../controllers/user.controller');
var mdAuth = require('../middlewares/authenticated');


var api = express.Router();

api.post('/saveUser', userController.saveUser); //Guardar un usuario con un role user.


module.exports = api;