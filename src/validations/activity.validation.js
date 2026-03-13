const Joi = require('joi');
const { objectId, checkValidEthereumAddress } = require('./custom.validation');
const { tradeType } = require('../config/other.constant');

const addActivity = {
  body: Joi.object().keys({
    number_of_token: Joi.number().required(),
    number_of_token_received: Joi.number().required(),
    price_per_token: Joi.number().required(),
    activity_type: Joi.number().required().valid(tradeType.BUY, tradeType.SELL, tradeType.CANCEL),
    transaction_hash: Joi.string().required(),
    trade_id: Joi.custom(objectId).required(),
    from_address: Joi.string().required().custom(checkValidEthereumAddress),
    to_address: Joi.string().required().custom(checkValidEthereumAddress),
    current_wallet_address: Joi.string().required().custom(checkValidEthereumAddress),
    chain_id: Joi.number().required(),
  }),
};

const addPreMarketActivity = {
  body: Joi.object().keys({
    number_of_token: Joi.number().required(),
    price_per_token: Joi.number().required(),
    transaction_hash: Joi.string().required(),
    trade_id: Joi.custom(objectId).required(),
    from_address: Joi.string().required().custom(checkValidEthereumAddress),
    to_address: Joi.string().required().custom(checkValidEthereumAddress),
    current_wallet_address: Joi.string().required().custom(checkValidEthereumAddress),
    invest_token_amount: Joi.number().required(),
    claim_token_amount: Joi.number().required(),
    chain_id: Joi.number().required(),
  }),
};



const addPreMarketInvestment = {
  body: Joi.object().keys({
    invest_token_amount: Joi.number().required(),
    claim_token_amount: Joi.number().required(),
    trade_id: Joi.custom(objectId).required(),
    wallet_address: Joi.string().required().custom(checkValidEthereumAddress),
    chain_id: Joi.number().required(),
  }),
};

const claimInvestment = {
  body: Joi.object().keys({
    wallet_address: Joi.string().required().custom(checkValidEthereumAddress),
    chain_id: Joi.number().required(),
    is_claimed: Joi.boolean().required(),
    is_distributed: Joi.boolean().required(),
  }),
};

module.exports = {
  addActivity,
  addPreMarketActivity,
  addPreMarketInvestment,
  claimInvestment
};
