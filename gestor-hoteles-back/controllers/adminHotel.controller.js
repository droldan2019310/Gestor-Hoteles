'use strict'

var user = require('../models/User');
var bcrypt = require('..bcrypt-nodejs');
var jwt = require('../services/jwt');



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



module.exports = {
    saveUserAdmin
}