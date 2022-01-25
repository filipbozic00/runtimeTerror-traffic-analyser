var express = require('express');
var router = express.Router();
var CameraController = require('../controllers/CameraController.js');
var multer = require('multer');
var upload = multer({dest: 'public/images/'});

/*
 * GET
 */
router.get('/', CameraController.list);
router.get('/add', CameraController.displayAdd);

/*
 * GET
 */
router.get('/:id', CameraController.show);

/*
 * POST
 */
router.post('/', upload.single('image'), CameraController.create);
router.post('/cam', CameraController.createCam);

/*
 * PUT
 */
router.put('/:id', CameraController.update);

/*
 * DELETE
 */
router.delete('/:id', CameraController.remove);

module.exports = router;
