'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var hotelSchema = Schema({
    name: String,
    phone: Number,
    email: String,
    addres: String,
    description: String,
    descAddress: String,
    images: 
        [{
            image: String
         }]
    ,
    users: [{type: Schema.ObjectId, ref: 'users'}],
    rooms: [{type: Schema.ObjectId, ref: 'room'}],
    features: [{type: Schema.ObjectId, ref: 'feature'}],
})

module.exports = mongoose.model('hotel', hotelSchema);