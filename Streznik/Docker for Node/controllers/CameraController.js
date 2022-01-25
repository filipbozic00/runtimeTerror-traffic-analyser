const { render } = require('../app.js');
var CameraModel = require('../models/CameraModel.js');
var CarsController = require('./CarsController.js');

const tasks = [];

function doNext() {
    const task = tasks[0];
    if (!task || task.active) return;

    task.active = true;

    new Promise((resolve) => {
        try {
            task.process(resolve);
        } catch (ex) {
            console.error(ex);
            resolve(null);
        }
    }).then((result) => {
        task.resolve(result);

        tasks.shift();
        console.log('Tasks remaining: ' + tasks.length);
        doNext();
    });
}

function add(process) {
    return new Promise((resolve) => {
        tasks.push({
            process,
            resolve,
        });

        doNext();
    });
}

/**
 * CameraController.js
 *
 * @description :: Server-side logic for managing Cameras.
 */
module.exports = {

    /**
     * CameraController.list()
     */
    list: function (req, res) {
        CameraModel.find(function (err, Cameras) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Camera.',
                    error: err
                });
            }
            var data = [];
            data.cameras = Cameras
            return res.status(201).json(Cameras);
        });
    },

    displayAdd: function (req, res) {
        return res.render('camera/addCamera');
    },

    /**
     * CameraController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        CameraModel.findOne({
            _id: id
        }, function (err, Camera) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Camera.',
                    error: err
                });
            }

            if (!Camera) {
                return res.status(404).json({
                    message: 'No such Camera'
                });
            }

            return res.status(201).json(Camera);
        });
    },

    /**
     * CameraController.create()
     */
    create: function (req, res) {
        console.log(req.body);
        var Camera = new CameraModel({
            src: 'images/' + req.file.filename
        });

        Camera.save(function (err, Camera) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating Camera',
                    error: err
                });
            }

            // const spawn = require("child_process").spawn;
            // const pythonProcess = spawn('python',["../../../Backend/ObjectRecognition/cars_detection.py", '--image', Camera.src]);

            // console.log('python result: ' + pythonProcess);
            return res.status(201).json(Camera);
        });
    },

    createCam: function (req, res) {
        console.log(req.body);
        var Camera = new CameraModel({
            src: req.body.filepath,
            link: req.body.link
        });

        Camera.save(function (err, Camera) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating Camera',
                    error: err
                });
            }

            let sendData = {};
            sendData.image_id = Camera._id;
            sendData.location_id = req.body.location_id;
            add(function (resolve) {
                const spawn = require("child_process").spawn;
                const pythonProcess = spawn('python', ["../../Backend/ObjectRecognition/cars_detection.py", '--image', 'http://localhost:3001/' + Camera.src]);
                pythonProcess.stdout.on('data', function (data) {
                    console.log('Pipe data from python script ...');
                    sendData.python = data.toString();
                    console.log('python result:');
                    console.log(sendData.python);
                    CarsController.createFromImage(sendData);
                    resolve();
                });
                pythonProcess.on('exit', resolve);
                pythonProcess.on('error', function (err) {
                    console.error(err);
                    resolve();
                });
            });
        });
    },

    /**
     * CameraController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        CameraModel.findOne({
            _id: id
        }, function (err, Camera) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Camera',
                    error: err
                });
            }

            if (!Camera) {
                return res.status(404).json({
                    message: 'No such Camera'
                });
            }

            Camera.src = req.body.src ? req.body.src : Camera.src;

            Camera.save(function (err, Camera) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating Camera.',
                        error: err
                    });
                }

                return res.json(Camera);
            });
        });
    },

    /**
     * CameraController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        CameraModel.findByIdAndRemove(id, function (err, Camera) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the Camera.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    }
};