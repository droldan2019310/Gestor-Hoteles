'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var invoiceBackupSchema = Schema({
    number: Number,    
    serie: String,
    date: Date,
    users: [{type: Schema.ObjectId, ref: 'user'}],
    features: [{type: Schema.ObjectId, ref: 'feature'}],
    reservations: [{type: Schema.ObjectId, ref: 'reservation'}],
    totalNet: Number,
    total: Number,
    cash: Number,
    remaining: Number
})

module.exports = mongoose.model('invoicebackup', invoiceBackupSchema);