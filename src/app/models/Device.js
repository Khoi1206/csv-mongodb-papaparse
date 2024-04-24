const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Device = new Schema({}, { strict: false });

module.exports = mongoose.model('Device', Device);
