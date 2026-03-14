const { OTCTokenType } = require('../../config/other.constant');
const { CryptoToken, Portfolio, Activity } = require('../../models');


const queryTokens = async (chain_id) => {
  const totalTokens = await CryptoToken.countDocuments({is_deleted: false, chain_id: Number(chain_id)});
  const tokens = await CryptoToken.aggregate([
    {
      $match: {is_deleted: false, chain_id: Number(chain_id)}
    },
    {
      $sort: {_id: -1}
    },
    {
      $project: {
        _id: 1,
        name: 1,
        symbol: 1,
        token_address: 1,
        token_image: 1,
        number_of_decimals: 1,
        chain_id: 1,
        price: 1,
      }
    },
  ]);
  return {tokens, totalTokens};
};


const createToken = async (data) => {
  return CryptoToken.create(data);
};

const updateToken = async (token_id, data) => {
  return CryptoToken.updateOne({ _id: token_id}, data);
};

const deleteToken = async (token_id) => {
  return CryptoToken.updateOne({ _id: token_id}, { is_deleted: true });
};

const getTokenById = async (token_id) => {
  return CryptoToken.findById(token_id).lean();
};

const getTokensByChainId = async (chain_id) => {
  return CryptoToken.find({chain_id: chain_id});
};

const getTokenByAddressAndChainId = async (address, chain_id) => {
  return CryptoToken.findOne({token_address: address, chain_id: chain_id});
};


const getTokenByAddress = async (address) => {
  return CryptoToken.findOne({token_address: address});
};

const findTokenInPortfolio = async (token_id) => {
  const portfolio = await Portfolio.findOne({token_id: token_id});
  return portfolio;
};

const addToPortfolio = async (data) => {
  return Portfolio.create(data);
};

const getLastTradedPrice = async (token_id) => {
  const token = await Activity.find({token_id: token_id}).sort({created_at: -1}).limit(1);
  return token;
};

const getCustomTokenAddedbyAdmin = async (skip, limit, chain_id, name) => {
  const conditions = {
    is_deleted: false,
    token_type: OTCTokenType.CUSTOM
  }
  if (name) {
    Object.assign(conditions, {name: name});
  }

  if(chain_id) {
    Object.assign(conditions, {chain_id: Number(chain_id)});
  }

  const totalTokens = await CryptoToken.countDocuments(conditions);
  const tokens = await CryptoToken.aggregate([
    {
      $match: conditions
    },
    { $skip: skip },
    { $limit: limit },
    {
      $project: {
        _id: 1,
        name: 1,
        symbol: 1,
        token_address: 1,
        token_image: 1,
        number_of_decimals: 1,
        chain_id: 1,
        price: 1,
      }
    }
  ]);
  return {tokens, totalTokens};
};


module.exports = {
  queryTokens,
  createToken,
  updateToken,
  deleteToken,
  getTokenById,
  getTokensByChainId,
  getTokenByAddressAndChainId,
  getTokenByAddress,
  findTokenInPortfolio,
  addToPortfolio,
  getLastTradedPrice,
  getCustomTokenAddedbyAdmin,
};
