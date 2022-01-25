var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var TrafficSignSchema = new Schema({
	'symbol' : String,
	'location' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'GPS'
	},
	'image' : {
		type: Schema.Types.ObjectId,
		ref: 'TrafficSignImages'
	}
});

module.exports = mongoose.model('TrafficSign', TrafficSignSchema);
