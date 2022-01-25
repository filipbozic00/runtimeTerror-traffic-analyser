var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var LicensePlateSchema = new Schema({
	'symbols' : String,
	'imageSource' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'Camera'
	}
});

module.exports = mongoose.model('LicensePlate', LicensePlateSchema);
