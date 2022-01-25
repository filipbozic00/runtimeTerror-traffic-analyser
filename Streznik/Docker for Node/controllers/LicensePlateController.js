var LicenseplateModel = require('../models/LicensePlateModel.js');

/**
 * LicensePlateController.js
 *
 * @description :: Server-side logic for managing LicensePlates.
 */
module.exports = {

    /**
     * LicensePlateController.list()
     */
    list: function (req, res) {
        LicenseplateModel.find().populate('imageSource').exec(function (err, LicensePlates) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting LicensePlate.',
                    error: err
                });
            }
            // var data = [];
            // data.licenseplates = LicensePlates
            return res.status(201).json(LicensePlates);
        });
    },

    displayAdd: function(req, res) {
        return res.render('licenseplate/addLicensePlate');
    },

    /**
     * LicensePlateController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        LicenseplateModel.findOne({_id: id}, function (err, LicensePlate) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting LicensePlate.',
                    error: err
                });
            }

            if (!LicensePlate) {
                return res.status(404).json({
                    message: 'No such LicensePlate'
                });
            }

            return res.json(LicensePlate);
        });
    },

    /**
     * LicensePlateController.create()
     */
    create: function (req, res) {
        var LicensePlate = new LicenseplateModel({
			symbols : req.body.symbols,
			imageSource : req.body.imageSource
        });

        LicensePlate.save(function (err, LicensePlate) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating LicensePlate',
                    error: err
                });
            }

            return res.status(201).json(LicensePlate);
        });
    },

    /**
     * LicensePlateController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        LicenseplateModel.findOne({_id: id}, function (err, LicensePlate) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting LicensePlate',
                    error: err
                });
            }

            if (!LicensePlate) {
                return res.status(404).json({
                    message: 'No such LicensePlate'
                });
            }

            LicensePlate.symbols = req.body.symbols ? req.body.symbols : LicensePlate.symbols;
			LicensePlate.imageSource = req.body.imageSource ? req.body.imageSource : LicensePlate.imageSource;
			
            LicensePlate.save(function (err, LicensePlate) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating LicensePlate.',
                        error: err
                    });
                }

                return res.json(LicensePlate);
            });
        });
    },

    /**
     * LicensePlateController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        LicenseplateModel.findByIdAndRemove(id, function (err, LicensePlate) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the LicensePlate.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    }
};
