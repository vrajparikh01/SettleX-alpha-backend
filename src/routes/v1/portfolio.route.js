const express = require('express');
const validate = require('../../middlewares/validate');

const {portfolioController} = require('../../controllers/');

const router = express.Router();


router.get('/', portfolioController.getPortfolio);


module.exports = router;
