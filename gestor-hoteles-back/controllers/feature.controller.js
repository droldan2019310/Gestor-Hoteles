'use strict'

var Feature = require('../models/feature.module.');
var Hotel = require('../models/hotel.model');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');
var fs = require('fs');
var path = require('path');
function uploadImageFeature(req, res){
    var featureId = req.params.id;
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
                    Feature.findByIdAndUpdate(featureId, {img: fileName}, {new:true}, (err, featureUpdate)=>{
                        if(err){
                            return res.status(500).send({message: 'Error general'});
                        }else if(featureUpdate){
                            return res.send({feature: featureUpdate, featureImage: featureUpdate.featureUpdate});
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

function updateFeature(req, res){
    let hotelId = req.params.idU;
    let featureId = req.params.idC;
    let update = req.body;

        Hotel.findOne({_id: hotelId, features: featureId}, (err, featurePull)=>{
            if(err){
                    console.log(err)
                    return res.status(500).send({message: 'Error general'});
                }else if(featurePull){
                    Feature.findByIdAndUpdate(featureId, update, {new: true}, (err, updateFeature)=>{
                        if(err){
                            return res.status(500).send({message: 'Error general al actualizar'});
                        }else if(updateFeature){
                            return res.send({message: 'Servicio actualizadao', updateFeature});
                        }else{
                            return res.status(401).send({message: 'No se pudo actualizar el servicio'});
                        }
                    })
                }else{
                    return res.status(404).send({message: 'Hotel o servicio inexistente'});
                }
            })    
}


function removeFeature(req, res){
    let hotelId = req.params.idU;
    let featureId = req.params.idC;
    
        Hotel.findOneAndUpdate({_id: hotelId, features: featureId},{$pull: {features: featureId}}, {new:true}, (err, featurePull)=>{
                if(err){
                    return res.status(500).send({message: 'Error general'})
                }else if(featurePull){
                    Feature.findByIdAndRemove(featureId, (err, featureRemoved)=>{
                        if(err){
                            return res.status(500).send({message: 'Error general al eliminar el servicio, pero sí eliminado del registro de hotel', err})
                        }else if(featureRemoved){
                            return res.send({message: 'Servicio eliminado permanentemente', featureRemoved});
                        }else{
                            return res.status(404).send({message: 'Registro no encontrado o ya eliminado'})
                        }
                    })
                }else{
                    return res.status(404).send({message: 'No existe el hotel que contiene el servicio a eliminar'})
                }
            }).populate('features')
}

function getFeatureByHotel(req,res){
    let hotelId = req.params.idU;

    Hotel.findById({_id: hotelId}).populate('features').exec((err, hotels)=>{
        if(err){
            return res.status(500).send({message: 'Error general'})
        }else if(hotels){
            return res.send({message: 'Hoteles encontrados', hotels})
        }else{
            return res.status(404).send({message: 'No hay registros'})
        }
    })
}


function getImageFeature(req, res){
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

module.exports = {
    uploadImageFeature,
    updateFeature,
    removeFeature,
    getFeatureByHotel,
    getImageFeature
}