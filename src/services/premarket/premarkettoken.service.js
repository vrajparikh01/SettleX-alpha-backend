const { PremaketTokenType } = require('../../config/other.constant');
const { PreMarketCryptoToken } = require('../../models');


const queryTokens = async (skip, limit, chain_id) => {
  // await PreMarketCryptoToken.updateMany({}, {$set : {tge: 1729426169, start_date: 1729080569, end_date: 1729339769}});
  const totalTokens = await PreMarketCryptoToken.countDocuments({is_deleted: false, token_type: PremaketTokenType.NORMAL, chain_id: Number(chain_id)});
  const tokens = await PreMarketCryptoToken.aggregate([
    {
      $match: {is_deleted: false, token_type: PremaketTokenType.NORMAL, chain_id: Number(chain_id)}
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
        tge: 1,
        start_date: 1,
        end_date: 1    
     }
    },
    { $skip: skip },
    { $limit: limit },
  ]);
  return {tokens, totalTokens};
};

const queryCollateralTokens = async (skip, limit, chain_id) => {
  const totalTokens = await PreMarketCryptoToken.countDocuments({is_deleted: false, token_type: PremaketTokenType.COLLATERAL, chain_id: Number(chain_id)});
  const tokens = await PreMarketCryptoToken.aggregate([
    {
      $match: {is_deleted: false, token_type: PremaketTokenType.COLLATERAL, chain_id: Number(chain_id)}
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
        tge: 1,
        start_date: 1,
        end_date: 1  
     }
    },
    { $skip: skip },
    { $limit: limit },
  ]);
  return {tokens, totalTokens};
};

const createToken = async (data) => {
  return PreMarketCryptoToken.create(data);
};

const updateToken = async (token_id, data) => {
  return PreMarketCryptoToken.updateOne({ _id: token_id}, data);
};


const getTokenById = async (token_id) => {
  return PreMarketCryptoToken.findById(token_id).lean();
};

const getTokensByChainId = async (chain_id) => {
  return PreMarketCryptoToken.find({chain_id: chain_id});
};

const getTokenByAddressAndChainId = async (address, chain_id) => {
  return PreMarketCryptoToken.findOne({token_address: address, chain_id: chain_id});
};


const getTokenByAddress = async (address) => {
  return PreMarketCryptoToken.findOne({token_address: address});
};





module.exports = {
  queryTokens,
  queryCollateralTokens,
  createToken,
  updateToken,
  getTokenById,
  getTokensByChainId,
  getTokenByAddressAndChainId,
  getTokenByAddress,
};
