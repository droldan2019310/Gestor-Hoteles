'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var featureSchema = Schema({
    title: String,
    preferences: String,
    desc: String,
    img: String,
    slogan: String,
    type: String,
    price: Number,
    features: [{type: Schema.ObjectId, ref: 'feature'}],
})

module.exports = mongoose.model('feature', featureSchema);