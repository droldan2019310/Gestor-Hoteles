'use strict'

var Hotel = require('../models/hotel.model.js');
var User =  require('../models/user.model');
var Room =  require('../models/room.model');
var Feature =  require('../models/feature.module.');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');

var fs = require('fs');
var path = require('path');

//CRUD HOTELES
function saveHotel(req, res){
    var hotel = new Hotel();
    var params = req.body;

    if(params.name && params.phone && params.email && params.addres && params.description){
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
                hotel.description = params.description;

                hotel.save((err, hotelSaved)=>{
                    if(err){
                        return res.status(500).send({message: 'Error general al guardar hotel'});
                    }else if(hotelSaved){
                        return res.send({message: 'Hotel creado exitosamente', hotelSaved});
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
                    Hotel.findByIdAndUpdate(hotelId, {$push:{images:{image: fileName}}}, {new:true}, (err, hotelUpdate)=>{
                        if(err){
                            return res.status(500).send({hotel: hotelUpdate});
                        }else if(hotelUpdate){
                            return res.send({hotel: hotelUpdate, hotelImage: hotelUpdate.images});
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

function getImage(req, res){
    var fileName = req.params.fileName;
    var pathFile = './uploads/users/' + fileName;
    var params = req.body;
        fs.exists(pathFile, (exists)=>{
        if(exists){
            return res.sendFile(path.resolve(pathFile))
        }else{
           return res.status(404).send({message: 'Imagen inexistente'});
        }
    }) 
}


function updateHotel(req, res){
    let hotelId = req.params.id;
    let update = req.body;

            if(update.name){
                Hotel.findOne({name: update.name}, (err, hotelFind)=>{
                    if(err){
                        return res.status(500).send({ message: 'Error general'});
                    }else if(hotelFind){
                        if(hotelFind._id == hotelId){   
                             Hotel.findByIdAndUpdate(hotelId, update, {new: true}, (err, hotelUpdate)=>{
                                if(err){
                                    return res.status(500).send({message: 'Error general al actualizar'});
                                }else if(hotelUpdate){
                                    return res.send({message: 'Hotel actualizado', hotelUpdate});
                                }else{
                                    return res.send({message: 'No se pudo actualizar al hotel'});
                                }
                            })
                        }else{
                            return res.send({message: 'Nombre de hotel ya en uso'});    
                        }
                    }else{
                        Hotel.findByIdAndUpdate(hotelId, update, {new: true}, (err, hotelUpdate)=>{
                            if(err){
                                return res.status(500).send({message: 'Error general al actualizar'});
                            }else if(hotelUpdate){
                                return res.send({message: 'Hotel actualizado', hotelUpdate});
                            }else{
                                return res.send({message: 'No se pudo actualizar al hotel'});
                            }
                        })
                    }
                })
            }else{
                Hotel.findByIdAndUpdate(hotelId, update, {new: true}, (err, hotelUpdate)=>{
                    if(err){
                        return res.status(500).send({message: 'Error general al actualizar'});
                    }else if(hotelUpdate){
                        return res.send({message: 'Hotel actualizado', hotelUpdate});
                    }else{
                        return res.send({message: 'No se pudo actualizar al hotel'});
                    }
                })
            }
}

function removeHotel(req, res){
    let hotelId = req.params.id;
    
    Hotel.findByIdAndRemove(hotelId, (err, hotelFind)=>{
        if(err){
            return res.status(500).send({message: 'Error general'})
        }else if(hotelFind){
            return res.send({message: 'Hotel eliminado', hotelDrop:hotelFind})
        }else{
            return res.status(404).send({message: 'Hotel no encontrado o ya eliminado'})
        }
    })
}

//Setear usuarios a hotels
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
                        return res.status(500).send({message: "error general"});
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

//Setear servicios a hotels
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
                        return res.send({message: 'Servicio creado y agregado', pushFeature, featureSaved});
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

//setear cuartos a hoteles
function setRoomHotel(req, res){
    var hotelId = req.params.id;
    var params = req.body;
    var room = new Room();

    if(params.nameRoom && params.priceRoom && params.descRoom && params.typeRoom && params.amountRoom){
                
        room.nameRoom = params.nameRoom;
        room.priceRoom = params.priceRoom;
        room.descRoom = params.descRoom;
        room.typeRoom = params.typeRoom;
        room.amountRoom = params.amountRoom;
        room.availableRoom = params.amountRoom;
        room.status = params.status;

        room.save((err, roomSaved)=>{
            if(err){
                return res.status(500).send({message: 'Error general'});
            }else if(roomSaved){
                Hotel.findByIdAndUpdate(hotelId, {$push:{rooms: roomSaved._id}}, {new: true}, (err, pushRoom)=>{
                    if(err){
                        return res.status(500).send({message: 'Error general al agregar la habitación'});
                    }else if(pushRoom){
                        return res.send({message: 'Habitación creada y agregada', pushRoom,roomSaved});
                    }else{
                        return res.status(404).send({message: 'No se seteo la habitación, pero sí se creó en la base de datos'});
                    }
                }).populate('rooms')
            }else{
                return res.status(500).send({message: 'No se guardó el servicio'});
            }
        })
    }else{
        return res.status(401).send({message: 'Por favor envía los datos mínimos para la creación de tu habitación'})   
    }
}


function findUserByHotel(req, res){
    let userId = req.params.idU;

    User.findById(userId, (err, userFind)=>{
        if(err){
            return res.status(500).send({message: 'Error general'});
        }else if(userFind){
            Hotel.findOne({users: userFind._id}, (err, hotelFind)=>{
                if(err){
                    return res.status(500).send({message: 'Error general'});
                }else if(hotelFind){
                    return res.send({message: 'Hotel encontrado', hotelFind});
                }else{
                    return res.status(500).send({message: 'No se encontro ningun usuario con este id'});
                }
            }).populate("features")
        }else {
            return res.status(500).send({message: 'No se encontro ningun usuario con este id'});
        }

    })

}

function best3Hotel(req,res){
    var mysort = { name: +1 };

    Hotel.find({}, (err,hotelFind)=>{
        if(err){
            return res.status(500).send({message: 'Error general'});
        }else if(hotelFind){
            return res.send({message: 'Hotel encontrado', hotelFind});
        }else{
            return res.status(500).send({message: 'No se encontro ningun usuario con este id'});
        }
    }).limit(3).sort(mysort).populate("rooms")
}


function best1Hotel(req,res){
    Hotel.findOne({}, (err,hotelFind)=>{
        if(err){
            return res.status(500).send({message: 'Error general'});
        }else if(hotelFind){
            return res.send({message: 'Hotel encontrado', hotelFind});
        }else{
            return res.status(500).send({message: 'No se encontro ningun usuario con este id'});
        }
    }).limit(1).populate("rooms")
}
function getHotels(req,res){
    Hotel.find({}, (err,hotelFind)=>{
        if(err){
            return res.status(500).send({message: 'Error general'});
        }else if(hotelFind){
            return res.send({message: 'Hotel encontrado', hotelFind});
        }else{
            return res.status(500).send({message: 'No se encontro ningun usuario con este id'});
        }
    }).populate("rooms")
}
function searchHotel(req,res){
    let id = req.params.HotelId;
    Hotel.findById(id, (err,hotelFind)=>{
        if(err){
            return res.status(500).send({message: 'Error general'});
        }else if(hotelFind){
            return res.send({message: 'Hotel encontrado', hotelFind});
        }else{
            return res.status(500).send({message: 'No se encontro ningun usuario con este id'});
        }
    }).populate("rooms")
}
module.exports = {
    saveHotel,
    uploadImageHotel,
    setUserHotel,
    setFeatureHotel,
    getImage,
    updateHotel,
    removeHotel,
    setRoomHotel,
    findUserByHotel,
    best3Hotel,
    best1Hotel,
    getHotels,
    searchHotel
}