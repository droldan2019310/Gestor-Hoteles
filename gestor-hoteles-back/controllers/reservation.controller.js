'use strict'

var Hotel = require('../models/hotel.model.js');
var User =  require('../models/user.model');
var Room =  require('../models/room.model');
var Reservation =  require('../models/reservation.model');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');

var fs = require('fs');
var path = require('path');
const { update } = require('../models/hotel.model.js');

function saveReservation(req, res){
    let userId = req.params.idU;
    let hotelId = req.params.idH;
    let roomId = req.params.idR;

    var params = req.body;
    var reservation = new Reservation();

    if(params.dateEntry && params.dateExit && params.countGuest){
        reservation.dateEntry = params.dateEntry;
        reservation.dateExit = params.dateExit;
        reservation.countRoom = params.countRoom;
        reservation.countGuest = params.countGuest;
        reservation.status = 'EN PROCESO';

        reservation.save((err, resevSaved)=>{
            if(err){
                return res.status(500).send({message: 'Error general'});
            }else if(resevSaved){
                Reservation.findByIdAndUpdate(resevSaved._id, {$push:{users: userId}}, {new: true}, (err, pushUser)=>{
                    if(err){
                        return res.status(500).send({message: 'Error general al guardar usuairo'});
                    }else if(pushUser){
                        Reservation.findByIdAndUpdate(resevSaved._id, {$push:{hotels: hotelId}}, {new: true}, (err, pushHotel)=>{
                            if(err){
                                return res.status(500).send({message: 'Error general al guardad hotel'});
                            }else if(pushHotel){
                                Reservation.findByIdAndUpdate(resevSaved._id, {$push:{rooms: roomId}}, {new: true}, (err, pushRoom)=>{
                                    if(err){
                                        return res.status(500).send({message: 'Error general al guardar habitacion'});
                                    }else if(pushRoom){
                                        Reservation.findById(resevSaved._id, (err, reservComplete)=>{
                                            if(err){
                                                return res.status(500).send({message: 'Error general al buscar su reservacion'});
                                            }else if(reservComplete){
                                                return res.send({message:"se registró tu reservación",reservationComplete: reservComplete});
                                            }else{

                                                return res.status(500).send({message: 'No se encontro su reservacion'});
                                            }
                                        })
                                        }else{
                                            
                                        return res.status(402).send({message: 'No se encontro ninguna habitacion'});
                                    }
                                })
                            }else{
                                
                                return res.status(402).send({message: 'No se guardó su reservación'});
                            }
                        })
                    }else{
                        
                        return res.status(500).send({message: 'No se guardó el usuario'});
                    }
                })
            }else{
                
                return res.status(500).send({message: 'No se guardó su reservación'});
            }
        })
    }else{
        return res.status(401).send({message: 'Por favor envía los datos mínimos para la creación de tu reservación'})   
    }
}
  

function updateReservation(req, res){
    let reservId = req.params.id;
    let update = req.body;

    Reservation.findByIdAndUpdate(reservId, update, {new: true}, (err, reservUpdated)=>{
        if(err){
            return res.status(500).send({message: 'Error general al actualizar'});
        }else if(reservUpdated){
            return res.send({message: 'Reservacion actualizada', reservUpdated});
        }else{
            return res.send({message: 'No se pudo actualizar'});
        }
    })
}

function removeReserv(req,res){
    let reservId = req.params.id;

    Reservation.findByIdAndRemove(reservId, (err, reservDrop)=>{
        if(err){
            return res.status(500).send({message: 'Error general'})
        }else if(reservDrop){
            return res.send({message: 'Reservacion eliminada', reservRemoved:reservDrop})
        }else{
            return res.status(404).send({message: 'Reservacion no encontrada o ya eliminada'})
        }
    })
}

function availableRoom(req, res){
    let hotelId = req.params.idH;
    let roomId = req.params.idR;
    let update = req.body;
    let ava;
        Hotel.findOne({_id: hotelId, rooms: roomId}, (err, roomPull)=>{
            if(err){
                    return res.status(500).send({message: 'Error general'});
                }else if(roomPull){                    
                    Room.findById(roomId, (err, roomFind)=>{
                        if(err){
                            return res.status(500).send({message: 'Error general'});
                        }else if(roomFind){
                            ava = roomFind.availableRoom*1;
                            if(ava == 0){
                                update.status = 'No disponible'

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
                                update.status = 'Disponible'

                                Room.findByIdAndUpdate(roomId, update, {new: true}, (err, updateRoom)=>{
                                    if(err){
                                        return res.status(500).send({message: 'Error general al actualizar'});
                                    }else if(updateRoom){
                                        return res.send({message: 'Habitación actualizada', updateRoom});
                                    }else{
                                        return res.status(401).send({message: 'No se pudo actualizar la habitación'});
                                    }
                                })
                            }
                        }else{
                            return res.status(402).send({message: 'No se encontraron registros'});
                        }
                    })
                }else{
                    return res.status(404).send({message: 'Hotel o habitación inexistente'});
                }
            }) 
}

function cancerlarRevserv(req, res){
    let reservId = req.params.id;
    let update = req.body;

    update.status = 'Cancelada';

    Reservation.findByIdAndUpdate(reservId, update, {new: true}, (err, reservUpdated)=>{
        if(err){
            return res.status(500).send({message: 'Error general al actualizar'});
        }else if(reservUpdated){
            return res.send({message: 'Reservacion actualizada', reservUpdated});
        }else{
            return res.send({message: 'No se pudo actualizar'});
        }
    })

}

function countReserv(req,res){
    Reservation.countDocuments({}, (err,reservs)=>{
        if(err){
            return res.status(500).send({message: 'Error general'})
        }else if(reservs){
            return res.send({message: 'Reservaciones encontrados', countReservs: reservs})
        }else{
            return res.status(404).send({message: 'No hay registros'})
        }
    })
}

function countReservByHotel(req,res){
   let hotelId = req.params.idHotel;
    Reservation.countDocuments({hotels: hotelId}, (err,reservs)=>{
        if(err){
            return res.status(500).send({message: 'Error general'})
        }else if(reservs){
            return res.send({message: 'Reservaciones encontrados', countReservs: reservs})
        }else{
            return res.status(404).send({message: 'No hay registros'})
        }
    })
}


function reservsByHotel(req, res){
    let hotelId = req.params.id;

    Hotel.findById(hotelId, (err, hotelFind)=>{
        if(err){
            return res.status(500).send({message: 'Error general'})
        }else if(hotelFind){
            Reservation.find({hotels: hotelFind._id}, (err, reservsFind)=>{
                if(err){
                    return res.status(500).send({message: 'Error general'})
                }else if(reservsFind){
                    return res.send({message: 'Reservaciones encontrados', reservsFind})
                }else{
                    return res.status(404).send({message: 'No hay registros 2'})
                }
            })
        }else{
            return res.status(404).send({message: 'No hay registros 1 '})
        }
    })
}

function reservsAddHotel(req,res){
    let hotelId = req.params.id;
    let update = req.body;
    let cantidad = 1;

    Hotel.findById(hotelId, (err, hotelFind)=>{
        if(err){
            return res.status(500).send({message: 'Error general1'})
        }else if(hotelFind){
            if(hotelFind.cantReservs*1 >= 0){
                cantidad = hotelFind.cantReservs*1;
            }else{
                cantidad = 1;
            }
            
            update.cantReservs = (cantidad*1)+1;

            Hotel.findByIdAndUpdate(hotelId, update, {new: true}, (err, hotelUpdated)=>{
                if(err){
                    return res.status(500).send({message: 'Error general al actualizar'});
                }else if(hotelUpdated){
                    return res.send({message: 'cantidad de reservaciones: ',hotelUpdated});
                }else{
                    return res.send({message: 'No se pudo actualizar'});
                }
            })        }else{
            return res.status(404).send({message: 'No hay registros'})
        }
    })
}

function reservsByUser(req,res){
    let userId = req.params.id;

    Reservation.find({users: userId}, (err, reservsFind)=>{
        if(err){
            return res.status(500).send({message: 'Error general'});
        }else if(reservsFind){
            return res.send({message: 'cantidad de reservaciones: ',reservsFind});
        }else{
            return res.status(404).send({message: 'No hay registros'})
        }

    }).populate("rooms")
}


function best3HotelCount(req,res){
    var mysort = { name: +1 };
    let hotelId = req.params.id;

            Reservation.countDocuments({}, (err,reservFind)=>{
                if(err){
                    return res.status(500).send({message: 'Error general'});
                }else if(reservFind){
                    return res.send({message: 'cantidad de reservaciones: ',reservFind});
                }else{
                    return res.status(404).send({message: 'No hay registros'})
                }
            }).populate("hotels")       
}


function usersByHotelCount(req, res){
    let hotelId = req.params.id;
    var cant = 1*1;
    var cant2 = 1*1;
    var reservation = new Reservation();

    Reservation.find({hotels: hotelId},(err, reservFind)=>{
        if(err){
            return res.status(500).send({message: 'Error general'});
        }else if(reservFind){
            return res.send({message: 'registros', huspedes:reservFind})
        }else{
            return res.status(404).send({message: 'No hay registros'})
        }
            })
}

module.exports = {
    saveReservation,
    availableRoom,
    removeReserv,
    updateReservation,
    cancerlarRevserv,
    countReserv,
    reservsByHotel,
    reservsAddHotel,
    reservsByUser,
    best3HotelCount,
    usersByHotelCount
    countReservByHotel,
    reservsAddHotel,
}