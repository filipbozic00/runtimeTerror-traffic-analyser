var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var CameraSchema = new Schema({
	'src' : String,
	'link' : String
});

module.exports = mongoose.model('Camera', CameraSchema);
