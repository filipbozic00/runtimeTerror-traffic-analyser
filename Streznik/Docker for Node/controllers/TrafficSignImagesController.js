var TrafficsignimagesModel = require('../models/TrafficSignImagesModel.js');

/**
 * TrafficSignImagesController.js
 *
 * @description :: Server-side logic for managing TrafficSignImagess.
 */
module.exports = {

    /**
     * TrafficSignImagesController.list()
     */
    list: function (req, res) {
        TrafficsignimagesModel.find(function (err, TrafficSignImagess) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting TrafficSignImages.',
                    error: err
                });
            }

            return res.status(201).json(TrafficSignImagess);
        });
    },

    displayAdd: function(req, res) {
        return res.render('trafficsignimages/addTrafficSignImages');
    },

    /**
     * TrafficSignImagesController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        TrafficsignimagesModel.findOne({_id: id}, function (err, TrafficSignImages) {
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

            return res.json(TrafficSignImages);
        });
    },

    /**
     * TrafficSignImagesController.create()
     */
    create: function (req, res) {
        console.log(req.file);
        var TrafficSignImages = new TrafficsignimagesModel({
			name : req.body.name,
			path : 'images/' + req.file.filename,
        });

        TrafficSignImages.save(function (err, TrafficSignImages) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating TrafficSignImages',
                    error: err
                });
            }

            return res.status(201).json(TrafficSignImages);
        });
    },

    /**
     * TrafficSignImagesController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        TrafficsignimagesModel.findOne({_id: id}, function (err, TrafficSignImages) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting TrafficSignImages',
                    error: err
                });
            }

            if (!TrafficSignImages) {
                return res.status(404).json({
                    message: 'No such TrafficSignImages'
                });
            }

            TrafficSignImages.name = req.body.name ? req.body.name : TrafficSignImages.name;
			TrafficSignImages.path = req.body.path ? req.body.path : TrafficSignImages.path;
			
            TrafficSignImages.save(function (err, TrafficSignImages) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating TrafficSignImages.',
                        error: err
                    });
                }

                return res.json(TrafficSignImages);
            });
        });
    },

    /**
     * TrafficSignImagesController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        TrafficsignimagesModel.findByIdAndRemove(id, function (err, TrafficSignImages) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the TrafficSignImages.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    }
};
