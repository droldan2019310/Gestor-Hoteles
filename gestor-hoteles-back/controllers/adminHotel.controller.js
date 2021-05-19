'use strict'

var hotel = require('../models/hotel.model');
var user = require('../models/User');
var bcrypt = require('..bcrypt-nodejs');
var jwt = require('../services/jwt');

var fs = require('fs');
var path = require ('path');

function saveUserByAdmin(req, res) {
    var userId = req.params.id;
    var user = new User();
    var params = req.body;

    if(userId != req.user.sub){
        res.status(401).send({message: 'No tienes permiso para crear usuarios en esta ruta'})
    }else{
        if(params.name && params.username && params.email && params.password && params.role){
            User.findOne({username: params.username}, (err, userFind)=>{
                if(err){
                    return res.status(500).send({message: 'Error general en el servidor'});
                }else if(userFind){
                    return res.send({message: 'Nombre de usuario ya en uso'});
                }else{
                    bcrypt.hash(params.password, null, null, (err, passwordHash)=>{
                        if(err){
                            return res.status(500).send({message: 'Error general en la encriptación'});
                        }else if(passwordHash){
                            user.password = passwordHash;
                            user.name = params.name;
                            user.lastname = params.lastname;
                            user.role = params.role;
                            user.username = params.username.toLowerCase();
                            user.email = params.email.toLowerCase();
    
                            user.save((err, userSaved)=>{
                                if(err){
                                    return res.status(500).send({message: 'Error general al guardar'});
                                }else if(userSaved){
                                    return res.send({message: 'Usuario guardado', userSaved});
                                }else{
                                    return res.status(500).send({message: 'No se guardó el usuario'});
                                }
                            })
                        }else{
                            return res.status(401).send({message: 'Contraseña no encriptada'});
                        }
                    })
                }
            })
        }else{
            return res.send({message: 'Por favor ingresa los datos obligatorios'});
        }
    }
}

function getUsers(req, res){

    User.find({}).populate('').exec((err, users)=>{
            if(err){
                    return res.status(500).send({message: 'Error general en el servidor'})
            }else if(users){
                    return res.send({message: 'Usuarios: ', users})
            }else{
                    return res.status(404).send({message: 'No hay registros'})
            }
        })
}

let userId = req.params.id;

if(userId != req.user.sub){
    return res.status(403).send({message: 'No tienes permiso para realizar esta acción'});
}

function getUsers(req, res){
    User.find({}).exec((err, users)=>{ //Busqueda general (filtraciones)
        if(err){
            res.status(500).send({message: 'Error en el servidor al intentar buscar'})
        }else if(users){
            res.status(200).send({message: 'usuarios encontrados', users})
        }else{
            res.status(200).send({message: 'No hay registros'})
        }
    })
}