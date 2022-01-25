var TrafficsignModel = require('../models/TrafficSignModel.js');
var TrafficsignimagesModel = require('../models/TrafficSignImagesModel.js');

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
