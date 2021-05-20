'use strict'

var Room = require('../models/room.model');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');

var fs = require('fs');
var path = require('path');

function saveRoom(req, res){
    var room = new Room();
    var params = req.body;
    var fileName = 'Sin imagen';

        room.nameRoom = params.nameRoom;
        room.priceRoom = params.priceRoom;
        room.descRoom = params.descRoom;
        room.typeRoom = params.typeRoom;
        room.amountRoom = params.amountRoom;
        room.availableRoom = params.amountRoom;
        room.status = params.status;

        room.save((err, roomSaved)=>{
            if(err){
                return res.status(500).send({message: 'Error general al guardar su habitación'});
            }else if(roomSaved){
               return res.send({message: 'Se agrego la habitacion correctamente', roomSaved});
            }else{
                return res.status(500).send({message: 'No se guardó su habitación'});
            }
        })
}

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
    let roomId = req.params.id;
    let update = req.body;

    if(update.imgRoom){
        return res.status(402).send({message:'No puede actualizar la imgagen desde esta funcion'});
    }else{
    Room.findByIdAndUpdate(roomId, update, {new: true}, (err, roomUpdated)=>{
        if(err){
            return res.status(500).send({message: 'Error general al actualizar'});
        }else if(roomUpdated){
            return res.send({message: 'Habitacion actualizado', roomUpdated});
        }else{
            return res.send({message: 'No se pudo actualizar la habilitacion'});
        }
        })
    }
            
    
}

function removeRoom(req, res){
    let roomeId = req.params.id;
    let params = req.body;


    Room.findByIdAndRemove(roomeId, (err, roomDrop)=>{
        if(err){
            return res.status(500).send({message: 'Error general'})
        }else if(roomDrop){
            return res.send({message: 'Habitacion eliminado', userRemoved:roomDrop})
        }else{
            return res.status(404).send({message: 'Habitacion no encontrada o ya eliminada'})
        }
    })
}

module.exports = {
    saveRoom,
    getImageRoom,
    uploadImageRoom,
    updateRoom,
    removeRoom
}