const Joi = require('joi');
const { password, objectId, checkValidEthereumAddress } = require('./custom.validation');
const { OTCTokenType, PremaketTokenType } = require('../config/other.constant');

const createPremarketToken = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    symbol: Joi.string().required(),
    chain_id: Joi.number().required(),
    token_address: Joi.string().required().custom(checkValidEthereumAddress),
    token_image: Joi.string().required(),
    price: Joi.number().required(),
    tge: Joi.number().optional(),
    start_date: Joi.number().optional(),
    end_date: Joi.number().optional(),
    number_of_decimals: Joi.number().required(),
    wallet_address: Joi.string().required().custom(checkValidEthereumAddress),
    token_type: Joi.number().valid(...Object.values(PremaketTokenType)).required(),
  }),
};

const createOTCToken = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    symbol: Joi.string().required(),
    chain_id: Joi.number().required(),
    token_address: Joi.string().required().custom(checkValidEthereumAddress),
    token_image: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    number_of_decimals: Joi.number().required(),
    wallet_address: Joi.string().required().custom(checkValidEthereumAddress),
    token_type: Joi.number().valid(...Object.values(OTCTokenType)).required(),
  }),
};

const updatePremarketToken = {
  body: Joi.object().keys({
    tge: Joi.number().required(),
    start_date: Joi.number().required(),
    end_date: Joi.number().required(),
    wallet_address: Joi.string().required().custom(checkValidEthereumAddress),
    chain_id: Joi.number().required(),
  }),
};

const getTokenAddedbyAdmin = {
  query: Joi.object().keys({
      chain_id: Joi.number().optional(),
      page: Joi.number().required(),
      name: Joi.string().optional(),
  })
}

module.exports = {
  createPremarketToken,
  updatePremarketToken,
  createOTCToken,
  getTokenAddedbyAdmin
};
