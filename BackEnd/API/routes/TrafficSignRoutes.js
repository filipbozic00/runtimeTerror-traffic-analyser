var express = require('express');
var router = express.Router();
var trafficSignController = require('../controllers/TrafficSignController.js');

/*
 * GET
 */
router.get('/', trafficSignController.list);
router.get('/add', trafficSignController.displayAdd);

/*
 * GET
 */
router.get('/:id', trafficSignController.show);
router.get('/:latitude/:longditude', trafficSignController.atLocation);

/*
 * POST
 */
router.post('/', trafficSignController.create);

/*
 * PUT
 */
router.put('/:id', trafficSignController.update);

/*
 * DELETE
 */
router.delete('/:id', trafficSignController.remove);

module.exports = router;
