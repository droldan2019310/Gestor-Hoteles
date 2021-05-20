'use strict'

var Feature = require('../models/feature.module.');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');

function saveFeature(req, res){
    var feature = new Feature();
    var params = req.body;

    if(params.title && params.preferences && params.desc && params.img && params.price && params.type){
                
    }else{
        return res.status(401).send({message: 'Por favor envía los datos mínimos para la de tu servicio'})   
    }

}


module.exports = {

}