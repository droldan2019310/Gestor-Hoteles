'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var addresSchema = Schema({
    departament: String,
    descDepartament: String
})

module.exports = mongoose.model('addre', addresSchema)


