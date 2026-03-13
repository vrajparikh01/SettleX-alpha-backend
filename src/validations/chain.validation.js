const Joi = require('joi');
const { objectId } = require('./custom.validation');

const addChain = {
  body: Joi.object().keys({
    chain_id: Joi.number().required(),
    name: Joi.string().required(),
    currency: Joi.string().required(),
    image: Joi.string().required(),
  }),
};


module.exports = {
  addChain
};
