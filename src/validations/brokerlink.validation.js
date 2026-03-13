const Joi = require('joi');
const { checkValidEthereumAddress } = require('./custom.validation');
const { tradeType } = require('../config/other.constant');

const createLink = {
  body: Joi.object().keys({
    offer_token: Joi.string().required().custom(checkValidEthereumAddress),
    receive_token: Joi.string().required().custom(checkValidEthereumAddress),
    client_address: Joi.string().required().custom(checkValidEthereumAddress),
    broker_address: Joi.string().required().custom(checkValidEthereumAddress),
    total_token: Joi.number().required(),
    price_per_token: Joi.number().required(),
    broker_fee: Joi.number().required(),
    trade_type: Joi.number().required().valid(tradeType.BUY, tradeType.SELL),
    lot_size: Joi.number().required(),
    chain_id: Joi.number().required(),
    expire_time: Joi.number().required(),
  }),
};

module.exports = {
  createLink,
};
