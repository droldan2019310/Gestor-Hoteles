'use strict'

var User = require('../models/user.model');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');


function saveUser(req, res){
    var user = new User();
    var params = req.body;

    if(params.name && params.username && params.email && params.password){
        User.findOne({username:params.username},(err,userFind)=>{
            if(err){
                return res.status(500).send({message: 'Error general'})
            }else if(userFind){
                return res.send({message: 'Nombre de usuario no disponible'})
            }else{
                bcrypt.hash(params.password, null, null,(err,passwordHash)=>{
                    if(err){
                        return res.status(500).send({message: 'Error general al comparar contraseña'})
                    }else if(passwordHash){
                        user.password = passwordHash;
                        user.name = params.name;
                        user.lastname = params.lastname;
                        user.username = params.username;
                        user.email = params.email;
                        user.phone = params.phone;
                        user.role = params.role; //Opciones: 'ROLE_USER'                      

                        if((params.role != 'ROLE_USER')){
                            return res.status(401).send({message: 'No tiene permiso para  crear este tipo de usuario.'});
                        }else{
                            user.save((err, userSaved)=>{
                                if(err){
                                    return res.status(500).send({message: 'Error general al guardar usuario'});
                                }else if(userSaved){
                                    return res.send({message: 'Usuario creado exitosamente', userSaved});
                                }else{
                                    return res.status(500).send({message: 'No se guardó el usuario'});
                                }
                            })
                        }
                    }else{
                        return res.status(403).send({message: 'La contraseña no se ha encriptado'});
                    }
                })
            }
        })

    }
}

function pruebaController(req, res){
    res.status(200).send({message: 'Respuesta desde el controlador'});
}


function updateUser(req, res){
    let userId = req.params.id;
    let update = req.body;

    if(update.username){
        User.findOne({username: update.username}, (err, usernameFind)=>{
            if(err){
                res.status(500).send({message: 'Error en el servidor'})
            }else if(usernameFind){
                res.status(200).send({message: 'Nombre de usario ya en uso, no se puede actualizar'})
            }else{                
                User.findByIdAndUpdate(userId, update, {new: true},(err, userUpdated)=>{
                    if(err){
                        res.status(500).send({message: 'Error en el servidor al intentar actualizar'});
                    }else if(userUpdated){
                        res.status(200).send({message: 'usuario actualizado', userUpdated});
                    }else{
                        res.status(200).send({message: 'No hay registro para actualizar'});
                    }
                })
            }
        })
    }else{
        User.findByIdAndUpdate(userId, update, {new: true},(err, userUpdated)=>{
            if(err){
                res.status(500).send({message: 'Error en el servidor al intentar actualizar'});
            }else if(userUpdated){
                res.status(200).send({message: 'usuario actualizado', userUpdated});
            }else{
                res.status(200).send({message: 'No hay registro para actualizar'});
            }
        })
    } 
}

function removeUser(req, res){
    let userId = req.params.id;
    var params = req.body;

    User.findByIdAndRemove(userId, (err, userRemoved)=>{
        bcrypt.compare(params.password, userRemoved.password, (err, checkPassword)=>{
            if(err){
                res.status(500).send({message: 'Error en el servidor'});
            }else if(userRemoved){
                res.status(200).send({message: 'Usuario eliminado', userRemoved});
            }else{
                res.status(200).send({message: 'No existe el usuario o ya fue eliminado'});
            }
        })
    })
}


module.exports = {
    saveUser,
    pruebaController,
    updateUser,
    removeUser
}