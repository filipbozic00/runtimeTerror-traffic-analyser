var CarsModel = require('../models/CarsModel.js');
var GpsModel = require('../models/GPSModel.js');

/**
 * CarsController.js
 *
 * @description :: Server-side logic for managing Carss.
 */
module.exports = {

    /**
     * CarsController.list()
     */
    list: function (req, res) {
        CarsModel.find().populate('location').populate('imageSource').exec(function (err, Cars) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Cars.',
                    error: err
                });
            }

            // var data = [];
            // data.cars = Cars;
            // console.log(Cars);
            return res.status(201).json(Cars);
        });
    },

    displayAdd: function(req, res) {
        return res.render('car/addCar');
    },

    /**
     * CarsController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        CarsModel.findOne({_id: id}, function (err, Cars) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Cars.',
                    error: err
                });
            }

            if (!Cars) {
                return res.status(404).json({
                    message: 'No such Cars'
                });
            }

            return res.json(Cars);  
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
                            CarsModel.findOne({location: closestLocation._id}, function (err, Cars) {
                                if (err) {
                                    return res.status(500).json({
                                        message: 'Error when getting Cars.',
                                        error: err
                                    });
                                }
                
                                if (!Cars) {
                                    return res.status(404).json({
                                        message: 'No such Cars'
                                    });
                                }
                
                                return res.json({ carNumber: Cars.numberOfCars, latitude: closestLocation.latitude, longitude: closestLocation.longditude });  
                            }).populate('location').exec();
                        }
                    });
                });
            });
        });
    },

    /**
     * CarsController.create()
     */
    create: function (req, res) {
        var Cars = new CarsModel({
			numberOfCars : req.body.numberOfCars,
			averageSpeed : req.body.averageSpeed,
			location : req.body.location,
			imageSource : req.body.imageSource,
            licensePlate: req.body.licensePlate
        });

        Cars.save(function (err, Cars) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating Cars',
                    error: err
                });
            }

            return res.status(201).json(Cars);
        });
    },

    createFromApp: function (req, res) {
        console.log(req);
        var Cars = new CarsModel({
			numberOfCars : req.python,
			averageSpeed : 0,
			location : req.location_id,
			imageSource : req.image_id,
            licensePlate: [ req.license_plate ]
        });

        Cars.save(function (err, Cars) {
            if (err) {
                return err;
            }
        });
    },

    createFromImage: function (req, res) {
        console.log(req);
        var Cars = new CarsModel({
			numberOfCars : req.python,
			averageSpeed : 0,
			location : req.location_id,
			imageSource : req.image_id,
            licensePlate: [ 'N/A' ]
        });

        Cars.save(function (err, Cars) {
            if (err) {
                return err;
            }
        });
    },

    /**
     * CarsController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        CarsModel.findOne({_id: id}, function (err, Cars) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Cars',
                    error: err
                });
            }

            if (!Cars) {
                return res.status(404).json({
                    message: 'No such Cars'
                });
            }

            Cars.numberOfCars = req.body.numberOfCars ? req.body.numberOfCars : Cars.numberOfCars;
			Cars.averageSpeed = req.body.averageSpeed ? req.body.averageSpeed : Cars.averageSpeed;
			Cars.location = req.body.location ? req.body.location : Cars.location;
			Cars.imageSource = req.body.imageSource ? req.body.imageSource : Cars.imageSource;
            Cars.licensePlate = req.body.licensePlate ? req.body.licensePlate : Cars.licensePlate;
			
            Cars.save(function (err, Cars) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating Cars.',
                        error: err
                    });
                }

                return res.json(Cars);
            });
        });
    },

    /**
     * CarsController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        CarsModel.findByIdAndRemove(id, function (err, Cars) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the Cars.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    }
};
