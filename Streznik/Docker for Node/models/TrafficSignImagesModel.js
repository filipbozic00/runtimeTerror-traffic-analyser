var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var TrafficSignImagesSchema = new Schema({
	'name' : String,
	'path' : String
});

module.exports = mongoose.model('TrafficSignImages', TrafficSignImagesSchema);
