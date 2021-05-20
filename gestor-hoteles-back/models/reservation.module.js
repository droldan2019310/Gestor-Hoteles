'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var reservationSchema = Schema({
    users: [{type: Schema.ObjectId, ref: 'user'}],
    hotels: [{type: Schema.ObjectId, ref: 'hotel'}],
    rooms: [{type: Schema.ObjectId, ref: 'room'}],
    dateEntry: new Date(),
    dateExit: new Date(),
    countGuest: Number,
    status: String
})

module.exports = mongoose.model('reservation', reservationSchema);