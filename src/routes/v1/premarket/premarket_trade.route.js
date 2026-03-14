const express = require('express');
const {} = require('../../../middlewares/auth');
const validate = require('../../../middlewares/validate');
const tradeValidation = require('../../../validations/trade.validation');
const {PreMarketTradeController} = require('../../../controllers/index');

const router = express.Router();

router.post('/',  validate(tradeValidation['createPreMarketTrade']), PreMarketTradeController.createTrade);
router.get('/', PreMarketTradeController.getTrades);
router.get('/:wallet_address', PreMarketTradeController.getUserTrades);
router.put('/:trade_id', validate(tradeValidation['updatePreMarketTrade']), PreMarketTradeController.updateTrade);
router.patch('/cancel/:trade_id', validate(tradeValidation['cancelPreMarketTrade']), PreMarketTradeController.cancelTrade);


module.exports = router;
