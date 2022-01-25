var GpsModel = require('../models/GPSModel.js');

/**
 * GPSController.js
 *
 * @description :: Server-side logic for managing GPSs.
 */
module.exports = {

    /**
     * GPSController.list()
     */
    list: function (req, res) {
        GpsModel.find(function (err, GPSs) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting GPS.',
                    error: err
                });
            }
            // var data = [];
            // data.GPS = GPSs
            return res.status(201).json(GPSs);
        });
    },

    displayAdd: function(req, res) {
        return res.render('gps/addGPS');
    },

    /**
     * GPSController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        GpsModel.findOne({_id: id}, function (err, GPS) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting GPS.',
                    error: err
                });
            }

            if (!GPS) {
                return res.status(404).json({
                    message: 'No such GPS'
                });
            }

            return res.json(GPS);
        });
    },

    /**
     * GPSController.create()
     */
    create: function (req, res) {
        console.log(req.body);
        var GPS = new GpsModel({
			latitude : req.body.latitude,
			longditude : req.body.longditude,
			altitude : req.body.altitude,
			speed : req.body.speed,
			accuracy : req.body.accuracy
        });

        GPS.save(function (err, GPS) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating GPS',
                    error: err
                });
            }

            return res.status(201).json(GPS);
        });
    },

    /**
     * GPSController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        GpsModel.findOne({_id: id}, function (err, GPS) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting GPS',
                    error: err
                });
            }

            if (!GPS) {
                return res.status(404).json({
                    message: 'No such GPS'
                });
            }

            GPS.latitude = req.body.latitude ? req.body.latitude : GPS.latitude;
			GPS.longditude = req.body.longditude ? req.body.longditude : GPS.longditude;
			GPS.altitude = req.body.altitude ? req.body.altitude : GPS.altitude;
			GPS.speed = req.body.speed ? req.body.speed : GPS.speed;
			GPS.accuracy = req.body.accuracy ? req.body.accuracy : GPS.accuracy;
			
            GPS.save(function (err, GPS) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating GPS.',
                        error: err
                    });
                }

                return res.json(GPS);
            });
        });
    },

    /**
     * GPSController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        GpsModel.findByIdAndRemove(id, function (err, GPS) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the GPS.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    }
};
