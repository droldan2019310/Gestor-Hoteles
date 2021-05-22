'user strict'

var express = require('express');
var featureController = require('../controllers/feature.controller');
var mdAuth = require('../middlewares/authenticated');

var connectMultiparty = require('connect-multiparty');
var mdUpload = connectMultiparty({ uploadDir: './uploads/users'});

var api = express.Router();

api.put('/:idU/updateFeature/:idC', [mdAuth.ensureAuth, mdAuth.ensureAuthAdminHotel], featureController.updateFeature);
api.put('/:idU/removeFeature/:idC', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], featureController.removeFeature);

api.put('/:id/uploadImageFeature', [mdAuth.ensureAuth, mdUpload], featureController.uploadImageFeature);
api.get('/getImageFeature/:fileName', [ mdUpload], featureController.getImageFeature);

api.get('/:idU/getFeatureByHotel', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], featureController.getFeatureByHotel);



module.exports = api;