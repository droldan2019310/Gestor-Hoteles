'use strict'

var Addres = require('../models/addres.model');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');
const e = require('express');

function saveAddres(req, res){
    var addres = new Addres();
    var params = req.body;

    if(params.departament){
        Addres.findOne({departament: params.departament} , (err, addresFind)=>{
            if(err){
                return res.status(500).send({message: 'Error general en el servidor'});
            }else if(addresFind){
                return res.send({message: 'Direccion no disponible'});
            }else{
                addres.departament = params.departament;
                addres.descDepartament = params.descDepartament;

                addres.save((err,addresSaved)=>{
                    if(err){
                        return res.status(500).send({message: 'Error general al guardar'});
                    }else if(addresSaved){
                        return res.send({message: 'Direccion guardada', addresSaved});
                    }else{
                        return res.status(500).send({message: 'No se guardó la direccion'});
                    }
                })
            }

        })
    }else{
        return res.status(401).send({message: 'Por favor ingresa todos los datos obligatorios'});
    }
}

function getAddres(req, res){
    
    Addres.find({}).exec((err, adress)=>{
        if(err){
            return res.status(500).send({message: 'Error general'})
        }else if(adress){
            return res.send({message: 'Direcciones encontrados', adress})
        }else{
            return res.status(404).send({message: 'No hay registros'})
        }
    })
}

module.exports = {
    saveAddres,
    getAddres
}