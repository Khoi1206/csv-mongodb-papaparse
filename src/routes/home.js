const express = require('express');
const router = express.Router();

const homeController = require('../app/controllers/HomeController');

router.route('/').get(homeController.index);
router.route('/upload').post(homeController.uploadFile);
router.route('/delete').post(homeController.deleteDB);

module.exports = router;
