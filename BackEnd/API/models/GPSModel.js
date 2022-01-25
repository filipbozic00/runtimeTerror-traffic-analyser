var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var GPSSchema = new Schema({
	'latitude' : Number,
	'longditude' : Number,
	'altitude' : Number,
	'speed' : Number,
	'accuracy' : Number
});

module.exports = mongoose.model('GPS', GPSSchema);
