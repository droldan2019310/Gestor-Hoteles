'use strict'

var Hotel = require('../models/hotel.model.js');
var User =  require('../models/user.model');
var Feature =  require('../models/feature.module.');
var Reservation = require('../models/reservation.model.js');
var Invoice = require('../models/invoice.model.js');
var InvoiceBackup = require('../models/invoiceBackup.model.js');


function saveInvoice(req, res){
    let userId = req.params.idU;
    let reservsId = req.params.idR;

    var params = req.body;
    var invoice = new Invoice();

    if(params.date){

        invoice.number = Math.random(); 
        invoice.serie = 'A1';
        invoice.date = params.date;

        invoice.save((err, invoiceSaved)=>{
            if(err){
                return res.status(500).send({message: 'Error general al añadir factura'});
            }else if(invoiceSaved){
                Invoice.findByIdAndUpdate(invoiceSaved._id, {$push:{users: userId}}, {new: true}, (err, pushUser)=>{
                    if(err){
                        return res.status(500).send({message: 'Error general'});
                    }else if(pushUser){
                        Invoice.findByIdAndUpdate(invoiceSaved._id, {$push:{reservations: reservsId}}, {new: true}, (err, pushReservs)=>{
                            if(err){
                                return res.status(500).send({message: 'Error general al añadir hotel'});
                            }else if(pushReservs){
                                Invoice.findById(invoiceSaved._id, (err, invoiceComplete)=>{
                                    if(err){
                                        return res.status(500).send({message: 'Error general al buscar su factura'});
                                    }else if(invoiceComplete){
                                        return res.send({invoiceComplete: invoiceComplete});
                                    }else{
                                        return res.status(500).send({message: 'No se encontro su factura'});
                                    }
                                })
                            }else{
                                return res.status(402).send({message: 'No se pudo añadir hotel'})
                            }
                        })
                    }else{
                        return res.status(402).send({message: 'No se pudo añadir usuario'})
                    }
                })
            }else{
                return res.status(402).send({message: 'No se pudo generar la factura'})
            }
        })

    }else{
        return res.status(402).send({message: 'Peticion sin fecha. Por favor intentalo de nuevo'})
    }
}

function updateInvoice(req, res){
    let userId = req.params.idU;
    let featureId = req.params.idF;

    Invoice.findOne({users:userId}, (err, invoiceFind)=>{
        if(err){
            return res.status(500).send({message: 'Error general al buscar la factura'});
        }else if(invoiceFind){
            Invoice.findByIdAndUpdate(invoiceFind._id, {$push:{features: featureId}}, {new: true}, (err, pushFeature)=>{
                if(err){
                    return res.status(500).send({message: 'Error general al añadir servicio'});
                }else if(pushFeature){
                    return res.send({message: 'Se agrego servicio', pushFeature});
                }else{
                    return res.status(402).send({message: 'No se pudo agregar el servicio'})
                }
            })
        }else{
            return res.status(402).send({message: 'No se pudo buscar la factura'});
        }

    })
}

function transInvoice(req,res){
    let invoiceId = req.params.idI;
    var invoiceBackup = new InvoiceBackup();

    Invoice.findById(invoiceId, (err, invoiceSaved)=>{
        if(err){
            return res.status(500).send({message: 'Error general'});
        }else if(invoiceSaved){
            
            invoiceBackup.number = invoiceSaved.number;
            invoiceBackup.serie = invoiceSaved.serie;
            invoiceBackup.date = invoiceSaved.date;
            invoiceBackup.users = invoiceSaved.users;
            invoiceBackup.features = invoiceSaved.features;
            invoiceBackup.reservations = invoiceSaved.reservations;
            invoiceBackup.totalNet = invoiceSaved.totalNet;
            invoiceBackup.total = invoiceSaved.total;
            invoiceBackup.cash = invoiceSaved.cash;
            invoiceBackup.remaining = invoiceSaved.remaining;

            invoiceBackup.save((err, backupSaved)=>{
                if(err){
                    return res.status(500).send({message: 'Error general al añadir factura'});
                }else if(backupSaved){
                    return res.send({message: 'Se transfirio',backupSaved });
                }else{
                    return res.status(402).send({message: 'No se pudo generar la factura'})
                }
            })

        }else{
            return res.status(402).send({message: 'No se pudo transferir el backup'})
        }
    })
}

//Esta busqueda se realiza en el modelo de invoiceBackup
function listInvoiceByUser(req, res){
    let userId = req.params.id;

    InvoiceBackup.find({users: userId}, (err, InvoiceFind)=>{
        if(err){
            return res.status(500).send({message: 'Error general al realizar la busqueda'})
        }else if(InvoiceFind){
            return res.send({message: 'Factura encontrada',InvoiceFind });
        }else{
            return res.status(404).send({message: 'No se pudo realizar la busqueda'})
        }
    })
}

//Esta busqueda se realiza en el modelo de invoiceBackup
function SearchInvoiceByUser(req, res){
    let userId = req.params.id;
    let invoiceId = req.params.idI;

    InvoiceBackup.find({users: userId, _id:invoiceId}, (err, InvoiceFind)=>{
        if(err){
            return res.status(500).send({message: 'Error general al realizar la busqueda'})
        }else if(InvoiceFind){
            return res.send({message: 'Factura encontrada',InvoiceFind });
        }else{
            return res.status(404).send({message: 'No se pudo realizar la busqueda'})
        }
    })

}

function payInvoice(req, res){
    let userId = req.params.id;
    let invoiceId = req.params.idI;
    let update = req.body;


    Invoice.find({users: userId, _id:invoiceId}, (err, InvoiceFind)=>{
        if(err){
            return res.status(500).send({message: 'Error general al realizar la busqueda'})
        }else if(InvoiceFind){
            Invoice.findByIdAndUpdate(InvoiceFind._id, update, {new: true}, (err, invoiceUpdate)=>{
                if(err){
                    return res.status(500).send({message: 'Error general al actualizar'});
                }else if(invoiceUpdate){
                    return res.send({message: 'Factura pagada', invoiceUpdate});
                }else{
                    return res.send({message: 'No se pudo actualizar'});
                }
            })
        }else{
            return res.status(404).send({message: 'No se pudo realizar la busqueda'})
        }
    })

}

module.exports = {
    saveInvoice,
    updateInvoice,
    transInvoice,
    listInvoiceByUser,
    SearchInvoiceByUser,
    payInvoice
}