'user strict'

var express = require('express');
var featureController = require('../controllers/feature.controller');
var mdAuth = require('../middlewares/authenticated');

var api = express.Router();


module.exports = api;