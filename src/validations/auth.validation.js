const Joi = require('joi');
const { checkValidEthereumAddress } = require('./custom.validation');


const login = {
  body: Joi.object().keys({
    wallet_address: Joi.string().required().custom(checkValidEthereumAddress),
    chainId: Joi.number().required(),
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};



const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};


module.exports = {
  login,
  logout,
  refreshTokens,
};
