'use strict'

var User = require('../models/user.model');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');


function saveUserAdmin(req, res){
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
                        user.role = params.role; //Opciones: 'ROLE_USER', 'ROLE_ADMIN','ROLE_ADMINHOTEL'                        

                        user.save((err, userSaved)=>{
                            if(err){
                                return res.status(500).send({message: 'Error general al guardar usuario'});
                            }else if(userSaved){
                                return res.send({message: 'Usuario creado exitosamente', userSaved});
                            }else{
                                return res.status(500).send({message: 'No se guardó el usuario'});
                            }
                        })
                    }else{
                        return res.status(403).send({message: 'La contraseña no se ha encriptado'});
                    }
                })
            }
        })

    }
}

function login(req, res){
    var params = req.body;
    
    if(params.username && params.password){
        User.findOne({username: params.username}, (err,userFind)=>{
            if(err){
                return res.status(500).send({message: 'Error general'});
            }else if(userFind){
                bcrypt.compare(params.password, userFind.password, (err, checkPassword)=>{
                    if(err){
                        return res.status(500).send({message: 'Error general al comparar contraseñas'});
                    }else if(checkPassword){
                        if(params.getToken){
                            res.send({
                                token: jwt.createToken(userFind),
			                	user: userFind
                            })
                        }else{
                            return res.send({message: 'Usuario logeado'});
                        }
                    }else{
                        return res.status(403).send({message: 'Usuario o contraseña incorrectos'});
                    }
                })
            }else{
                return res.status(401).send({message: 'Cuenta de usuario no encontrada'});
            }
        })

    }else{
        return res.status(404).send({message: 'Por favor envía los campos obligatorios'});
    }
}

function updateUserAdmin(req, res){
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
    let params = req.body;

    if(userId != req.user.sub){
        return res.status(403).send({message: ' No tienes permiso para realizar esta acción'})
    }else{
        if(!params.password){
            return res.status(401).send({message: 'Por favor ingresa la contraseña para poder eliminar tu cuenta'});
        }else{
            User.findById(userId, (err, userFind)=>{
                if(err){
                    return res.status(500).send({message: 'Error general'})
                }else if(userFind){
                    bcrypt.compare(params.password, userFind.password, (err, checkPassword)=>{
                        if(err){
                            return res.status(500).send({message: 'Error general al verificar contraseña'})
                        }else if(checkPassword){
                            User.findByIdAndRemove(userId, (err, userFind)=>{
                                if(err){
                                    return res.status(500).send({message: 'Error general al verificar contraseña'})
                                }else if(userFind){
                                    return res.send({message: 'Usuario eliminado', userRemoved:userFind})
                                }else{
                                    return res.status(404).send({message: 'Usuario no encontrado o ya eliminado'})
                                }
                            })
                        }else{
                            return res.status(403).send({message: 'Contraseña incorrecta, solo con tu contraseña podrás eliminar tu cuenta. Sino te recuerdas contacta a soporte.'})
                        }
                    })
                }else{
                    return res.status(404).send({message: 'Usuario inexistente o ya eliminado'})
                }
            })
        }
    }
}

function getUsers(req, res){
    User.find({}).populate('contacts').exec((err, users)=>{
        if(err){
            return res.status(500).send({message: 'Error general'})
        }else if(users){
            return res.send({message: 'Usuarios encontrados', users})
        }else{
            return res.status(404).send({message: 'No hay registros'})
        }
    })
}

function search(req, res){
    var params = req.body;

    if(params.search){
        User.find({$or:[{name: params.search},
                        {lastname: params.search},
                        {username: params.search}]}, (err, resultsSearch)=>{
                            if(err){
                                return res.status(500).send({message: 'Error general'})
                            }else if(resultsSearch){
                                return res.send({resultsSearch})
                            }else{
                                return res.status(404).send({message: 'No hay registros para mostrar'})
                            }
                        })
    }else{
        return res.status(403).send({message: 'Ingresa algún dato en el campo de búsqueda'})
    }
}

module.exports = {
    saveUserAdmin,
    login,
    updateUserAdmin,
    removeUser,
    getUsers,
    search
}