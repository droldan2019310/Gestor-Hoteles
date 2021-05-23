'user strict'

var express = require('express');
var invoiceController = require('../controllers/invoice.controller');
var mdAuth = require('../middlewares/authenticated');

var api = express.Router();

api.post('/saveInvoice/:idU/:idR',mdAuth.ensureAuth, invoiceController.saveInvoice); //Agregar factura con objectid de de reservacoin
api.put('/updateInvoice/:idU/:idF',mdAuth.ensureAuth, invoiceController.updateInvoice); //Update de factura para object id de servicios

api.put('/transInvoice/:idI',mdAuth.ensureAuth, invoiceController.transInvoice); //Transferir backup 
api.put('/payInvoice/:id/:idI',mdAuth.ensureAuth, invoiceController.payInvoice); //pagar factura

api.put('/listInvoiceByUser/:id',mdAuth.ensureAuth, invoiceController.listInvoiceByUser); //listar las facturas de dicho usuario
api.put('/SearchInvoiceByUser/:id/:idI',mdAuth.ensureAuth, invoiceController.SearchInvoiceByUser); //buscar facturas para dicho usuario




module.exports = api;