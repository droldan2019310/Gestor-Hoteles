'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var hotelSchema = Schema({
    name: String,
    phone: Number,
    email: String,
    nameAdmin: String,
    address: [{type: Schema.Object_Id, ref:'address'}],
    descAddress: String,
    img: String,
    room: [{type: SchemaObject_Id, ref:'room'}]
})

module.exports = mongoose.model('hotel', hotelSchema);