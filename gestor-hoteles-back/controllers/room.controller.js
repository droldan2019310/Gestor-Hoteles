'use strict'

var Room = require('../models/room.model');
var Hotel = require('../models/hotel.model');

var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');

var fs = require('fs');
var path = require('path');


function uploadImageRoom(req, res){
    var roomId = req.params.id;
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
                    Room.findByIdAndUpdate(roomId, {imgRoom: fileName}, {new:true}, (err, roomUpdate)=>{
                        if(err){
                            return res.status(500).send({message: 'Error general'});
                        }else if(roomUpdate){
                            return res.send({room: roomUpdate, roomImage: roomUpdate.imgRoom});
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


function getImageRoom(req, res){
    var fileName = req.params.fileName;
    var pathFile = './uploads/users/' + fileName;

    fs.exists(pathFile, (exists)=>{
        if(exists){
            return res.sendFile(path.resolve(pathFile))
        }else{
           return res.status(404).send({message: 'Imagen inexistente'});
        }
    })
}

function updateRoom(req, res){
    let hotelId = req.params.idU;
    let roomId = req.params.idC;
    let update = req.body;

        Hotel.findOne({_id: hotelId, rooms: roomId}, (err, roomPull)=>{
            if(err){
                    return res.status(500).send({message: 'Error general'});
                }else if(roomPull){
                    Room.findByIdAndUpdate(roomId, update, {new: true}, (err, updateRoom)=>{
                        if(err){
                            return res.status(500).send({message: 'Error general al actualizar'});
                        }else if(updateRoom){
                            return res.send({message: 'Habitación actualizada', updateRoom});
                        }else{
                            return res.status(401).send({message: 'No se pudo actualizar la habitación'});
                        }
                    })
                }else{
                    return res.status(404).send({message: 'Hotel o habitación inexistente'});
                }
            }) 
}

function removeRoom(req, res){
    let hotelId = req.params.idU;
    let roomId = req.params.idC;
    
        Hotel.findOneAndUpdate({_id: hotelId, rooms: roomId},{$pull: {rooms: roomId}}, {new:true}, (err, roomPull)=>{
                if(err){
                    return res.status(500).send({message: 'Error general'})
                }else if(roomPull){
                    Room.findByIdAndRemove(roomId, (err, roomRemoved)=>{
                        if(err){
                            return res.status(500).send({message: 'Error general al eliminar la habitación, pero sí eliminado del registro de hotel', err})
                        }else if(roomRemoved){
                            return res.send({message: 'Habitación eliminada permanentemente', roomRemoved});
                        }else{
                            return res.status(404).send({message: 'Registro no encontrado o ya eliminado'})
                        }
                    })
                }else{
                    return res.status(404).send({message: 'No existe el hotel que contiene la habitación a eliminar'})
                }
            }).populate('rooms')
}

function getRoomByHotel(req,res){
    let hotelId = req.params.idU;

    Hotel.findById({_id: hotelId}).populate('rooms').exec((err, hotels)=>{
        if(err){
            return res.status(500).send({message: 'Error general'})
        }else if(hotels){
            return res.send({message: 'Hoteles encontrados', hotels})
        }else{
            return res.status(404).send({message: 'No hay registros'})
        }
    })
}

module.exports = {
    getImageRoom,
    uploadImageRoom,
    updateRoom,
    removeRoom,
    getRoomByHotel
}