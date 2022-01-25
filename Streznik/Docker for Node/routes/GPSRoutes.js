var express = require('express');
var router = express.Router();
var GPSController = require('../controllers/GPSController.js');

/*
 * GET
 */
router.get('/', GPSController.list);
router.get('/add', GPSController.displayAdd);

/*
 * GET
 */
router.get('/:id', GPSController.show);

/*
 * POST
 */
router.post('/', GPSController.create);

/*
 * PUT
 */
router.put('/:id', GPSController.update);

/*
 * DELETE
 */
router.delete('/:id', GPSController.remove);

module.exports = router;
