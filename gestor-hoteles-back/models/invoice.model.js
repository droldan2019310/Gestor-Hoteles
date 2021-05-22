'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var invoiceSchema = Schema({
    number: Number,    
    serie: String,
    date: new Date(),
    users: [{type: Schema.ObjectId, ref: 'user'}],
    features: [{type: Schema.ObjectId, ref: 'feature'}],
    reservation: [{type: Schema.ObjectId, ref: 'reservations'}],
    totalNet: Number,
    total: Number,
    cash: Number,
    remaining: Number
})

module.exports = mongoose.model('invoice', invoiceSchema);