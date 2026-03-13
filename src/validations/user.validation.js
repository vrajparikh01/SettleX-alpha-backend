const Joi = require('joi');
const { password, objectId, checkValidEthereumAddress } = require('./custom.validation');

const createUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    name: Joi.string().required(),
    role: Joi.string().required().valid('user', 'admin'),
  }),
};

const getUsers = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const updateUser = {
  body: Joi.object()
    .keys({
      email: Joi.string().allow(''),
      name: Joi.string(),
      telegram: Joi.string().allow(''),
      discord: Joi.string().allow(''),
    })
    .min(1),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const addNewWallet = {
  body: Joi.object().keys({
    address: Joi.string().required().custom(checkValidEthereumAddress),
    chainId: Joi.number().required(),
  })
}

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  addNewWallet
};
