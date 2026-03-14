const express = require('express');
const validate = require('../../../middlewares/validate');
const {brokersLinkValidation} = require('../../../validations');
const {brokersLinkController} = require('../../../controllers');

const router = express.Router();


router.post('/', validate(brokersLinkValidation.createLink), brokersLinkController.createLink);
router.get('/:link_id', brokersLinkController.findLinkById);
router.get('/list-for-user/:client_address', brokersLinkController.getBrokersLinksForUser);
router.get('/list-for-broker/:broker_address', brokersLinkController.getBrokersLinksForBroker);


module.exports = router;
