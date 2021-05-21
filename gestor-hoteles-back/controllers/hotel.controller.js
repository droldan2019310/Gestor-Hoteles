'use strict'

var Hotel = require('../models/hotel.model.js');
var User =  require('../models/user.model');
var Feature =  require('../models/feature.module.');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');

var fs = require('fs');
var path = require('path');


function saveHotel(req, res){
    var hotel = new Hotel();
    var params = req.body;

    if(params.name && params.phone && params.email && params.addres){
        Hotel.findOne({name: params.name}, (err, hotelFind)=>{
            if(err){
                return res.status(500).send({message: 'Erro general en el servidor'});
            }else if(hotelFind){
                return res.send({message: 'Nombre de hotel ya en uso'});
            }else{
                hotel.name = params.name;
                hotel.phone = params.phone;
                hotel.email = params.email;
                hotel.addres = params.addres;
                hotel.descAddress = params.descAddress;

                hotel.save((err, hotelSaved)=>{
                    if(err){
                        return res.status(500).send({message: 'Error general al guardar hotel'});
                    }else if(hotelSaved){
                        return res.send({message: 'Hotel creado exitosamente'});
                    }else{
                        return res.status(500).send({message: 'No se guardó el hotel'});
                    }
                })
            }
        })
    }else{
        return res.status(403).send({message: 'Por favor ingresa los datos minimos para la creacion del hotel'});
    }

}

function uploadImageHotel(req, res){
    var hotelId = req.params.id;
    var fileName = 'Sin imagen';

        if(req.files){
            //captura la ruta de la imagen
            var filePath = req.files.image.path;
            //separa en indices cada carpeta
            //si se trabaja en linux ('\');
            var fileSplit = filePath.split('\\');
            //captura el nombre de la imagen
            var fileName = fileSplit[2];

            var ext = fileName.split('\.');
            var fileExt = ext[1];

            if( fileExt == 'png' ||
                fileExt == 'jpg' ||
                fileExt == 'jpeg' ||
                fileExt == 'gif'){
                    Hotel.findByIdAndUpdate(hotelId, {img: fileName}, {new:true}, (err, hotelUpdate)=>{
                        if(err){
                            return res.status(500).send({message: 'Error general'});
                        }else if(hotelUpdate){
                            return res.send({hotel: hotelUpdate, hotelImage: hotelUpdate.img});
                        }else{
                            return res.status(404).send({message: 'No se actualizó'});
                        }
                    })
                }else{
                    fs.unlink(filePath, (err)=>{
                        if(err){
                            return res.status(500).send({message: 'Error al eliminar y la extensión no es válida'});
                        }else{
                            return res.status(403).send({message: 'Extensión no válida, y archivo eliminado'});
                        }
                    })
                }
        }else{
            return res.status(404).send({message: 'No has subido una imagen'});
        }
}

function setUserHotel(req,res){
    var hotelId = req.params.id;
    var params = req.body;
    var user = new User();

    User.findOne({username: params.username}, (err, userFind)=>{
        if(err){
            return res.status(500).send({message: 'Error general en el servidor'});
        }else if(userFind){
            if(userFind.role != 'ROLE_ADMINHOTEL'){
                return res.status(401).send({message: 'Tipo de usuario incorrecto'});
            }else{
                Hotel.findByIdAndUpdate(hotelId, {$push:{users: userFind._id}}, {new: true}, (err, pushUser)=>{
                    if(err){
                        return res.status(500).send({username: userFind.username});
                    }else if(pushUser){
                        return res.send({message: 'Usuario agregado al hotel', pushUser});
                    }else{
                        return res.status(404).send({message: 'No se seteo el usuario'});
                    }
                })
            }
        }else{
            return res.status(401).send({message: 'Usuario no encontrado'});
        }

    })
}


function setFeatureHotel(req, res){
    var hotelId = req.params.id;
    var params = req.body;
    var feature = new Feature();

    if(params.title && params.preferences && params.desc && params.price && params.type){
                
        feature.title = params.title;
        feature.preferences = params.preferences;
        feature.desc = params.desc;
        feature.slogan = params.slogan;
        feature.type = params.type;
        feature.price = params.price;

        feature.save((err, featureSaved)=>{
            if(err){
                return res.status(500).send({message: 'Error general'});
            }else if(featureSaved){
                Hotel.findByIdAndUpdate(hotelId, {$push:{features: featureSaved._id}}, {new: true}, (err, pushFeature)=>{
                    if(err){
                        return res.status(500).send({message: 'Error general al setear el servicio'});
                    }else if(pushFeature){
                        return res.send({message: 'Servicio creado y agregado', pushFeature});
                    }else{
                        return res.status(404).send({message: 'No se seteo el servicio, pero sí se creó en la BD'});
                    }
                }).populate('features')
            }else{
                return res.status(500).send({message: 'No se guardó el servicio'});
            }
        })
    }else{
        return res.status(401).send({message: 'Por favor envía los datos mínimos para la de tu servicio'})   
    }
}


module.exports = {
    saveHotel,
    uploadImageHotel,
    setUserHotel,
    setFeatureHotel
}