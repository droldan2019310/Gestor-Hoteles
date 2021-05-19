'user strict'

var express = require('express');
var adminController = require('../controllers/admin.controller');
var mdAuth = require('../middlewares/authenticated');


var api = express.Router();

api.post('/saveUserAdmin', adminController.saveUserAdmin); //Guardar un usuario con un role cualquiera.
api.post('/login', adminController.login); //login de todos los usuarios
api.put('/updateUserAdmin/:id', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], adminController.updateUserAdmin); //update de usuarios tipo admin
api.put('/removeUser/:id', mdAuth.ensureAuth, adminController.removeUser); //eliminar habilidato para todos los usuarios.
api.get('/getUsers', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], adminController.getUsers); //obtener todos los user. Opcion habil solo para admin.
api.post('/search', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], adminController.search) //Buscar user. Opcion habil solo para admin.\


module.exports = api;