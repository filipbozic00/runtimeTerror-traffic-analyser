var express = require('express');
var router = express.Router();
var CarsController = require('../controllers/CarsController.js');

/*
 * GET
 */
router.get('/', CarsController.list);
router.get('/add', CarsController.displayAdd);

/*
 * GET
 */
router.get('/:id', CarsController.show);

/*
 * POST
 */
router.post('/', CarsController.create);

/*
 * PUT
 */
router.put('/:id', CarsController.update);

/*
 * DELETE
 */
router.delete('/:id', CarsController.remove);

module.exports = router;
