const Joi = require('joi');
const { objectId, checkValidEthereumAddress } = require('./custom.validation');
const { tradeType } = require('../config/other.constant');

const createTrade = {
  body: Joi.object().keys({
    total_token: Joi.number().required(),
    total_receive_token: Joi.number().required(),
    trader_wallet_address: Joi.string().required(),
    price_per_token: Joi.number().required(),
    chain_id: Joi.number().required(),
    offer_token: Joi.string().required().custom(checkValidEthereumAddress),
    trade_type: Joi.number().required().valid(tradeType.BUY, tradeType.SELL),
    receive_token: Joi.string().required().custom(checkValidEthereumAddress),
    receiver_wallet_address: Joi.string().required().custom(checkValidEthereumAddress),
    lot_size: Joi.number().required(),
    trade_index_from_blockchain: Joi.number().required(),
    trade_hash_from_blockchain: Joi.string().required(),
    receive_token_symbol: Joi.string().required(),
    receive_token_name: Joi.string().required(),
    receive_token_decimals: Joi.number().required(),
    receive_token_image: Joi.string().required(),
    offer_token_symbol: Joi.string().required(),
    offer_token_name: Joi.string().required(),
    offer_token_image: Joi.string().required(),
    offer_token_decimals: Joi.number().required(),
    is_broker: Joi.boolean().required(),
    broker_fee: Joi.number().required(),
    broker_link_id: Joi.string().required(),
  }),
};

const createPreMarketTrade = {
  body: Joi.object().keys({
    price_per_token: Joi.number().required(),
    total_token: Joi.number().required(),
    trade_type: Joi.number().required().valid(tradeType.BUY, tradeType.SELL),
    collateral_token_amount: Joi.number().required(),
    offer_token: Joi.string().required().custom(checkValidEthereumAddress),
    receive_token: Joi.string().required().custom(checkValidEthereumAddress),
    trade_index_from_blockchain: Joi.number().required(),
    trade_hash_from_blockchain: Joi.string().required(),
    chain_id: Joi.number().required(),
    wallet_address: Joi.string().required().custom(checkValidEthereumAddress),
  }),
};

const updatePreMarketTrade = {
  body: Joi.object().keys({
    chain_id: Joi.number().required(),
    wallet_address: Joi.string().required().custom(checkValidEthereumAddress),
    is_distributed: Joi.boolean().required(),
    is_claimed: Joi.boolean().required(),
    is_untraded_claimed: Joi.boolean().optional(),
  }),
}

const cancelPreMarketTrade = {
  body: Joi.object().keys({
    chain_id: Joi.number().required(),
    wallet_address: Joi.string().required().custom(checkValidEthereumAddress),
  }),
}

module.exports = {
  createTrade,
  createPreMarketTrade,
  updatePreMarketTrade,
  cancelPreMarketTrade
};
