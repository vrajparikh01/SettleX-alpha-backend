const express = require('express');
const validate = require('../../middlewares/validate');
const {chainValidation} = require('../../validations/');
const {chainController} = require('../../controllers/');

const router = express.Router();


router.post('/', validate(chainValidation.addChain), chainController.addChain);


module.exports = router;
