const express = require('express');
const validate = require('../../../middlewares/validate');
const {tradeValidation} = require('../../../validations');
const {tradeController} = require('../../../controllers');

const router = express.Router();


router.post('/', validate(tradeValidation.createTrade), tradeController.createTrade);
router.get('/get-tokens-trades/:token_id', tradeController.getTokensTrades);
router.put('/view/:trade_id', tradeController.increaseViewCount);
router.get('/user-specific/:wallet_address', tradeController.getUserSpecificTrades);
router.get('/brokers', tradeController.getBrokersTrades);
router.get('/most-active-selling-trending', tradeController.getActiveSellingTrendingTrades);
router.get('/:trade_id', tradeController.getTrade);
router.get('/', tradeController.getTrades);
router.patch('/:trade_id', tradeController.cancelTrade);


module.exports = router;
