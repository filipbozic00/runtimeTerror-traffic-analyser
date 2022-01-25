var TrafficsignModel = require('../models/TrafficSignModel.js');
var TrafficsignimagesModel = require('../models/TrafficSignImagesModel.js');
var GpsModel = require('../models/GPSModel.js');

/**
 * trafficSignController.js
 *
 * @description :: Server-side logic for managing trafficSigns.
 */
module.exports = {

    /**
     * trafficSignController.list()
     */
    list: function (req, res) {
        TrafficsignModel.find().populate('location').populate('image').exec(function (err, trafficSigns) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting trafficSign.',
                    error: err
                });
            }
            // var data = [];
            // data.trafficsigns = trafficSigns;
            // console.log(trafficSigns);
            return res.status(201).json(trafficSigns);
        });
    },

    displayAdd: function(req, res) {
        return res.render('trafficsign/addTrafficSign');
    },

    /**
     * trafficSignController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        TrafficsignModel.findOne({_id: id}, function (err, trafficSign) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting trafficSign.',
                    error: err
                });
            }

            if (!trafficSign) {
                return res.status(404).json({
                    message: 'No such trafficSign'
                });
            }

            return res.json(trafficSign);
        });
    },

    atLocation: function (req, res) {
        var latitude = req.params.latitude;
        var longitude = req.params.longditude;

        console.log("Latitude: " + latitude);
        console.log("Longitude: " + longitude);
        
        var closestLocation = null;
        var nearest = 360;

        var bottomLeftQuadron = null;
        var bottomRightQuadron = null;
        var topLeftQuadron = null;
        var topRightQuadron = null;

        var locations = []; // GPS objects
        var distances = []; // Distance of each object from original coords

        GpsModel.findOne({latitude: { $lte: latitude }, longditude: { $lte: longitude }}, function (err1, location1) {
            if (err1) {
                return res.status(500).json({
                    message: 'Error when getting GPS bottomLeftQuadron.',
                    error: err1
                });
            }

            GpsModel.findOne({latitude: { $lte: latitude }, longditude: { $gt: longitude }}, function (err2, location2) {
                if (err2) {
                    return res.status(500).json({
                        message: 'Error when getting GPS bottomRightQuadron.',
                        error: err2
                    });
                }

                GpsModel.findOne({latitude: { $gt: latitude }, longditude: { $lte: longitude }}, function (err3, location3) {
                    if (err3) {
                        return res.status(500).json({
                            message: 'Error when getting GPS topLeftQuadron.',
                            error: err3
                        });
                    }

                    GpsModel.findOne({latitude: { $gt: latitude }, longditude: { $gt: longitude }}, function (err4, location4) {
                        if (err4) {
                            return res.status(500).json({
                                message: 'Error when getting GPS topRightQuadron.',
                                error: err4
                            });
                        }

                        if (!location1) {
                            console.log('No such GPS bottomLeftQuadron');
                            locations[0] = null;
                            distances[0] = 360;
                        } else {
                            bottomLeftQuadron = location1;
                            locations[0] = bottomLeftQuadron;
                            distances[0] = Math.sqrt(Math.pow(bottomLeftQuadron.latitude - latitude, 2) + Math.pow(bottomLeftQuadron.longditude - longitude, 2));
                        }

                        if (!location2) {
                            console.log('No such GPS bottomRightQuadron');
                            locations[1] = null;
                            distances[1] = 360;
                        } else {
                            bottomRightQuadron = location2;
                            locations[1] = bottomRightQuadron;
                            distances[1] = Math.sqrt(Math.pow(bottomRightQuadron.latitude - latitude, 2) + Math.pow(bottomRightQuadron.longditude - longitude, 2));
                        }

                        if (!location3) {
                            console.log('No such GPS topLeftQuadron');
                            locations[2] = null;
                            distances[2] = 360;
                        } else {
                            topLeftQuadron = location3;
                            locations[2] = topLeftQuadron;
                            distances[2] = Math.sqrt(Math.pow(topLeftQuadron.latitude - latitude, 2) + Math.pow(topLeftQuadron.longditude - longitude, 2));
                        }
            
                        if (!location4) {
                            console.log('No such GPS topRightQuadron');
                            locations[3] = null;
                            distances[3] = 360;
                        } else {
                            topRightQuadron = location4;
                            locations[3] = topRightQuadron;
                            distances[3] = Math.sqrt(Math.pow(topRightQuadron.latitude - latitude, 2) + Math.pow(topRightQuadron.longditude - longitude, 2));
                        }

                        //dist = sqrt((x2-x1)^2 + (y2-y1)^2)
                    
                        for (let index = 0; index < distances.length; index++) {
                            if (!distances[index] && nearest > distances[index] && distances[index] < 0.0004) {
                                nearest = distances[index];
                                closestLocation = locations[index];
                            }
                        }
                
                        console.log(closestLocation);
                        if (!closestLocation) {
                            return res.json("None");
                        } else {
                            TrafficsignModel.findOne({location: closestLocation._id}, function (err, trafficSign) {
                                if (err) {
                                    return res.status(500).json({
                                        message: 'Error when getting trafficSign.',
                                        error: err
                                    });
                                }
                
                                if (!trafficSign) {
                                    return res.status(404).json({
                                        message: 'No such trafficSign'
                                    });
                                }
                
                                return res.json({ signType: trafficSign.symbol, latitude: closestLocation.latitude, longitude: closestLocation.longditude });  
                            }).populate('location').exec();
                        }
                    });
                });
            });
        });
    },

    /**
     * trafficSignController.create()
     */
    create: function (req, res) {
        var trafficSign = new TrafficsignModel({
			symbol : req.body.symbol,
			location : req.body.location,
            image : ""
        });

        TrafficsignimagesModel.findOne({name: trafficSign.symbol}, function (err, TrafficSignImages) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting TrafficSignImages.',
                    error: err
                });
            }

            if (!TrafficSignImages) {
                return res.status(404).json({
                    message: 'No such TrafficSignImages'
                });
            }

            trafficSign.image = TrafficSignImages._id;

            trafficSign.save(function (err, trafficSign) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when creating trafficSign',
                        error: err
                    });
                }
    
                return res.status(201).json(trafficSign);
            });

        });
    },

    createFromImage: function (req, res) {
        console.log(req);
        var trafficSign = new TrafficsignModel({
			symbol : req.python,
			location : req.location_id,
			image: ""
        });

        TrafficsignimagesModel.findOne({name: trafficSign.symbol}, function (err, TrafficSignImages) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting TrafficSignImages.',
                    error: err
                });
            }

            if (!TrafficSignImages) {
                return res.status(404).json({
                    message: 'No such TrafficSignImages'
                });
            }

            trafficSign.image = TrafficSignImages._id;

            trafficSign.save(function (err, trafficSign) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when creating trafficSign',
                        error: err
                    });
                }
    
                return res.status(201).json(trafficSign);
            });

        });
    },

    /**
     * trafficSignController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        TrafficsignModel.findOne({_id: id}, function (err, trafficSign) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting trafficSign',
                    error: err
                });
            }

            if (!trafficSign) {
                return res.status(404).json({
                    message: 'No such trafficSign'
                });
            }

            trafficSign.symbol = req.body.symbol ? req.body.symbol : trafficSign.symbol;
			trafficSign.location = req.body.location ? req.body.location : trafficSign.location;
			
            trafficSign.save(function (err, trafficSign) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating trafficSign.',
                        error: err
                    });
                }

                return res.json(trafficSign);
            });
        });
    },

    /**
     * trafficSignController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        TrafficsignModel.findByIdAndRemove(id, function (err, trafficSign) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the trafficSign.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    }
};