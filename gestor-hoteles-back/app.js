'use strict'

var express = require('express');
var bodyParser = require('body-parser');
var adminRoutes = require('./routes/admin.route');
var userRoutes = require('./routes/user.route');
var addresRoutes = require('./routes/addres.route');
var roomRoutes = require('./routes/room.route');

var api = express();

api.use(bodyParser.urlencoded({extended: false}));
api.use(bodyParser.json());

api.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
	res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
	next();
});

api.use('/gestor', userRoutes);
api.use('/gestor', adminRoutes);
api.use('/gestor', addresRoutes);
api.use('/gestor', roomRoutes);


module.exports = api;