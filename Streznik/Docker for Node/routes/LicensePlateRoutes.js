var express = require('express');
var router = express.Router();
var LicensePlateController = require('../controllers/LicensePlateController.js');

/*
 * GET
 */
router.get('/', LicensePlateController.list);
router.get('/add', LicensePlateController.displayAdd);

/*
 * GET
 */
router.get('/:id', LicensePlateController.show);

/*
 * POST
 */
router.post('/', LicensePlateController.create);

/*
 * PUT
 */
router.put('/:id', LicensePlateController.update);

/*
 * DELETE
 */
router.delete('/:id', LicensePlateController.remove);

module.exports = router;
