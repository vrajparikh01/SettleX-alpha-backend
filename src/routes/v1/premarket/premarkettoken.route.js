const express = require('express');
const validate = require('../../../middlewares/validate');
const {onlyadmin} = require('../../../middlewares/auth');
const cryptoTokenValidation = require('../../../validations/cryptotoken.validation');
const {PreMarketTokenController} = require('../../../controllers/index');

const router = express.Router();


router.post('/', validate(cryptoTokenValidation['createPremarketToken']), onlyadmin, PreMarketTokenController.createToken);
router.put('/:token_id', validate(cryptoTokenValidation['updatePremarketToken']), onlyadmin, PreMarketTokenController.updateToken);
router.get('/', PreMarketTokenController.getTokens);
router.get('/collateral-list', PreMarketTokenController.getCollateralTokens);


module.exports = router;
