'use strict'

var User = require('../models/user.model');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');

function createInit(req,res){
    var adminName= 'Admin';
    var adminUserName = 'Admin';
    var adminPassword = '12345';
    var adminRole = 'ROLE_ADMIN';
    var user = new User();
    User.findOne({userName: adminUserName},(err,userFind)=>{
        if(err){
            console.log("error general",err);
        }else if(userFind){
            console.log("usuario ya existe, Usuario:Admin, password:12345");
        }else{
            bcrypt.hash(adminPassword,null,null,(err, passwordHash)=>{
                if(err){
                    console.log("error general al encriptar",err);
                }else if(passwordHash){
                    user.name = adminName;
                    user.userName = adminUserName;
                    user.password= passwordHash;
                    user.role = adminRole;
                    user.save((err,userSaved)=>{
                        if(err){
                            console.log("error general al guardar",err);
                        }else if(userSaved){
                            console.log("usuario creado, Usuario:Admin, password:12345");
                        }else{
                            console.log("no se pudo guardar el usuario");
                        }
                    })
                }else{
                    console.log("no se pudo encriptar");
                }
            })
        }
    })
}
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

    }else{
        return res.status(403).send({message: 'Ingrese los datos obligatorios'});     
    }
}

function pruebaController(req, res){
    res.status(200).send({message: 'Respuesta desde el controlador'});
}


function updateUser(req, res){
    let userId = req.params.id;
    let update = req.body;

    if(userId != req.user.sub){
        return res.status(401).send({ message: 'No tienes permiso para realizar esta acción'});
    }else{
        if(update.password || update.role){
            return res.status(401).send({ message: 'No se puede actualizar la contraseña ni el rol desde esta función'});
        }else{
            if(update.username){
                User.findOne({username: update.username.toLowerCase()}, (err, userFind)=>{
                    if(err){
                        return res.status(500).send({ message: 'Error general'});
                    }else if(userFind){
                        if(userFind._id == req.user.sub){
                            User.findByIdAndUpdate(userId, update, {new: true}, (err, userUpdated)=>{
                                if(err){
                                    return res.status(500).send({message: 'Error general al actualizar'});
                                }else if(userUpdated){
                                    return res.send({message: 'Usuario actualizado', userUpdated});
                                }else{
                                    return res.send({message: 'No se pudo actualizar al usuario'});
                                }
                            })
                        }else{
                            return res.send({message: 'Nombre de usuario ya en uso'});
                        }
                    }else{
                        User.findByIdAndUpdate(userId, update, {new: true}, (err, userUpdated)=>{
                            if(err){
                                return res.status(500).send({message: 'Error general al actualizar'});
                            }else if(userUpdated){
                                return res.send({message: 'Usuario actualizado', userUpdated});
                            }else{
                                return res.send({message: 'No se pudo actualizar al usuario'});
                            }
                        })
                    }
                })
            }else{
                User.findByIdAndUpdate(userId, update, {new: true}, (err, userUpdated)=>{
                    if(err){
                        return res.status(500).send({message: 'Error general al actualizar'});
                    }else if(userUpdated){
                        return res.send({message: 'Usuario actualizado', userUpdated});
                    }else{
                        return res.send({message: 'No se pudo actualizar al usuario'});
                    }
                })
            }
        }
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
    removeUser,
    createInit
}