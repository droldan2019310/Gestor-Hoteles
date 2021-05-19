'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secretKey = 'gestor-hoteles-g5';

exports.ensureAuth = (req, res, next)=>{
    if(!req.headers.authorization){
        return res.status(403).send({message: 'La petición no tiene cabecera de autenticación'});
    }else{
        var token = req.headers.authorization.replace(/['"']+/g, '');
        try{
            var payload = jwt.decode(token, secretKey);
            if(payload.exp <= moment().unix()){
                return res.status(401).send({message: 'Token expirado'});
            }
        }catch(err){
            return res.status(404).send({message: 'Token inválido'})
        }

        req.user = payload;
        next();
    }
}

exports.ensureAuthAdmin = (req, res, next)=>{
    var payload = req.user;

    if(payload.role != "ROLE_ADMIN"){
        return res.status(404).send({message: 'No tienes permiso para acceder a esta ruta'});
    }else{
        return next();
    }
}

exports.ensureAuthAdminHotel = (req, res, next)=>{
    var payload = req.user;

    if(payload.role != "ROLE_ADMIN" && payload.role != "ROLE_ADMINHOTEL"){
        return res.status(404).send({message: 'No tienes permiso para acceder a esta ruta'});
    }else{
        return next();
    }
}