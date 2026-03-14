const express = require('express');
const validate = require('../../../middlewares/validate');
const {activityValidation} = require('../../../validations');
const {PreMarketActivityController} = require('../../../controllers');

const router = express.Router();


router.post('/', validate(activityValidation.addPreMarketActivity), PreMarketActivityController.addActivity);
router.get('/activity-for-token/:token_id', PreMarketActivityController.getActivitiesForToken);
// router.post('/investment', validate(activityValidation.addPreMarketInvestment), PreMarketActivityController.addInvestment);
router.get('/investment/:wallet_address', PreMarketActivityController.getInvestments);
router.put('/investment/:investment_id', validate(activityValidation.claimInvestment), PreMarketActivityController.claimInvestment);

module.exports = router;
