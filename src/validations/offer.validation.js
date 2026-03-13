const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createOffer = {
  body: Joi.object().keys({
    number_of_token: Joi.number().required(),
    price_per_token: Joi.number().required(),
    trade_id: Joi.custom(objectId).required(),
  }),
};

const updateOffer = {
  body: Joi.object().keys({
    number_of_token: Joi.number().required(),
    price_per_token: Joi.number().required(),
    trade_id: Joi.custom(objectId).required(),
  }),
};


module.exports = {
  createOffer,
  updateOffer
};
