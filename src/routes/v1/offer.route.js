const express = require('express');
const validate = require('../../middlewares/validate');
const {offerValidation} = require('../../validations/');
const {offerController} = require('../../controllers/');

const router = express.Router();


router.post('/', validate(offerValidation.createOffer), offerController.createOffer);
router.put('/:offer_id', validate(offerValidation.updateOffer), offerController.updateOffer);
router.get('/count', offerController.countOffers);
router.get('/get-my-proposed-offers', offerController.getMyProposedOffers);
router.get('/:offer_id', offerController.getOffer);
router.get('/', offerController.getOffers);
router.delete('/:offer_id', offerController.removeOffer);
router.patch('/accept/:offer_id', offerController.acceptOffer);
router.patch('/reject/:offer_id', offerController.rejectOffer);


module.exports = router;
