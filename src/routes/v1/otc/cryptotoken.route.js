const express = require('express');
const validate = require('../../../middlewares/validate');
const cryptoTokenValidation = require('../../../validations/cryptotoken.validation');
const {cryptoTokenController} = require('../../../controllers/index');
const {onlyadmin} = require('../../../middlewares/auth');

const router = express.Router();


router.post('/', validate(cryptoTokenValidation['createOTCToken']), onlyadmin, cryptoTokenController.createToken);

router.get('/chain/:chain_id', cryptoTokenController.getTokens);

router.get('/gettokenformaddress/:token_address', cryptoTokenController.getTokenByAddress);

router.get('/tokens-added-by-admin', validate(cryptoTokenValidation['getTokenAddedbyAdmin']) ,cryptoTokenController.getCustomTokenAddedbyAdmin);

router.get('/:token_id', cryptoTokenController.getTokenById);


module.exports = router;
