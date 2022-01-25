var express = require('express');
var router = express.Router();
var TrafficSignImagesController = require('../controllers/TrafficSignImagesController.js');
var multer = require('multer');
var upload = multer({dest: 'public/images/'});

/*
 * GET
 */
router.get('/', TrafficSignImagesController.list);
router.get('/add', TrafficSignImagesController.displayAdd);

/*
 * GET
 */
router.get('/:id', TrafficSignImagesController.show);

/*
 * POST
 */
router.post('/', upload.single('image'), TrafficSignImagesController.create);

/*
 * PUT
 */
router.put('/:id', TrafficSignImagesController.update);

/*
 * DELETE
 */
router.delete('/:id', TrafficSignImagesController.remove);

module.exports = router;
