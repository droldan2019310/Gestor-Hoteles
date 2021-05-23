'user strict'

var express = require('express');
var invoiceController = require('../controllers/invoice.controller');
var mdAuth = require('../middlewares/authenticated');

var api = express.Router();

api.post('/saveInvoice/:idU/:idR',mdAuth.ensureAuth, invoiceController.saveInvoice); //Agregar reservación. (aplicar mecanismo para que takeRoom +1 and availableRoom-1)
api.put('/updateInvoice/:idU/:idF',mdAuth.ensureAuth, invoiceController.updateInvoice); //Agregar reservación. (aplicar mecanismo para que takeRoom +1 and availableRoom-1)
api.put('/transInvoice/:idI',mdAuth.ensureAuth, invoiceController.transInvoice); //Agregar reservación. (aplicar mecanismo para que takeRoom +1 and availableRoom-1)


module.exports = api;