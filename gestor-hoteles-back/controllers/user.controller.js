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
                        user.role = params.role; //Opciones: 'ROLE_USER', 'ROLE_ADMIN','ROLE_ADMINHOTEL'                        

                        if(params.role ='ROLE_ADMIN' ||'ROLE_ADMINHOTEL'){
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

module.exports = {
    saveUser
}