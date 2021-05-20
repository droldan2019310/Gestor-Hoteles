'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var roomSchema = Schema ({
    nameRoom: String,
    priceRoom: Number,
    descRoom: String,
    imgRoom: String,
    typeRoom: String,
    amountRoom: String,
    takeRoom: String,
    availableRoom: String,
    status: String
})


module.exports = mongoose.model('room', roomSchema);