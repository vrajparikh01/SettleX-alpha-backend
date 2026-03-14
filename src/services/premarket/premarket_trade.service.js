const { PreMarketTrade, PreMarketCryptoToken, User, ChainList } = require("../../models");
const { Types } = require("mongoose");
const { ObjectId } = Types;

const createTrade = async (data) => {
  const trade = await PreMarketTrade.create(data);
  return trade;
};

const updateTrade = async (tradeId, data) => {
  const trade = await PreMarketTrade.findByIdAndUpdate(tradeId, data);
  return trade;
};

const getTrades = async (skip, limit, name, chain_id, type) => {
  let matchQuery = {
    is_deleted: false,
    // is_settled: false,
    is_cancelled: false,
    // user_id: {$ne: new ObjectId(user_id)},
  }

  if(chain_id) {
    Object.assign(matchQuery, { chain_id: Number(chain_id) });
  }

  if (type !== 'all') {
    matchQuery.trade_type = type=="buy" ? 0 : 1; 
  }

  if(name) {
    matchQuery.$or = []
    const tokens = await PreMarketCryptoToken.find({ $or: [{ name: { $regex: name, $options: "i" } }, { name: { $regex: name, $options: "i" } }] });
    const tokenIds = tokens.map(token => token._id);
    matchQuery.$or.push({ offer_token: { $in: tokenIds } });
    matchQuery.$or.push({ receive_token: { $in: tokenIds } });
  }

  const totalTrades = await PreMarketTrade.countDocuments(matchQuery);

  const trades = await PreMarketTrade.aggregate([
    {
      $match: matchQuery
    },
    {
      $lookup: {
        from: PreMarketCryptoToken.collection.name,
        localField: "offer_token",
        foreignField: "_id",
        as: "offer_token",
      },
    },
    {
      $lookup: {
        from: PreMarketCryptoToken.collection.name,
        localField: "receive_token",
        foreignField: "_id",
        as: "receive_token",
      },
    },
    {
      $lookup: {
        from: User.collection.name,
        localField: "user_id",
        foreignField: "_id",
        as: "deal_creator",
      },
    },
    {
      $lookup: {
        from: ChainList.collection.name,
        localField: "chain_id",
        foreignField: "chain_id",
        as: "chain",
      },
    },
    {
      $unwind: "$offer_token",
    },
    {
      $unwind: "$receive_token",
    },
    {
      $unwind: "$deal_creator",
    },
    {
      $unwind: "$chain",
    },
    {
      $sort: {
        _id: -1,
      },
    },
    { $skip: skip },
    { $limit: limit },
    {
      $addFields: {
        total_price: { $multiply: ["$total_token", "$price_per_token"] },
        is_tge_start: false,
        is_investment_start: false,
        is_investment_end: false,
        number_of_token_require: 0,
        deal_creator_address: "$deal_creator.primary_address",
        start_date: "$offer_token.start_date",
        end_date: "$offer_token.end_date",
        tge: "$offer_token.tge",
      },
    },
    {
      $project: {
        id: 1,
        total_token: 1,
        collateral_token_amount: 1,
        price_per_token: 1,
        user_id: 1,
        token_id: 1,
        trade_type: 1,
        total_price: 1,
        view_count: 1,
        completion_percentage: 1,
        filled_token_amount: 1,
        available_token: 1,
        trade_index_from_blockchain: 1,
        "offer_token._id": 1,
        "offer_token.name": 1,
        "offer_token.price": 1,
        "offer_token.symbol": 1,
        "offer_token.token_address": 1,
        "offer_token.token_image": 1,
        "offer_token.number_of_decimals": 1,
        "receive_token._id": 1,
        "receive_token.name": 1,
        "receive_token.price": 1,
        "receive_token.symbol": 1,
        "receive_token.token_address": 1,
        "receive_token.token_image": 1,
        "receive_token.number_of_decimals": 1,
        number_of_token_require: 1,
        is_tge_start: 1,
        is_investment_start: 1,
        is_investment_end: 1,
        deal_creator_address: 1,
        is_distributed: 1,
        is_claimed: 1,
        start_date: 1,
        end_date: 1,
        tge: 1,
        "chain.chain_id": 1,
        "chain.name": 1,
        "chain.image": 1,
      },
    },
  ]);
  return {trades, totalTrades};
};

const getUsersTrades = async (skip, limit, name, user_id, chain_id) => {
  let matchQuery = {
    is_deleted: false,
    // is_settled: false,
    is_cancelled: false,
    user_id: new ObjectId(user_id),
  }

  if(chain_id) {
    Object.assign(matchQuery, { chain_id: Number(chain_id) });
  }

  if(name) {
    matchQuery.$or = []
    const tokens = await PreMarketCryptoToken.find({ $or: [{ name: { $regex: name, $options: "i" } }, { name: { $regex: name, $options: "i" } }] });
    const tokenIds = tokens.map(token => token._id);
    matchQuery.$or.push({ offer_token: { $in: tokenIds } });
    matchQuery.$or.push({ receive_token: { $in: tokenIds } });
  }

  const totalTrades = await PreMarketTrade.countDocuments(matchQuery);

  const trades = await PreMarketTrade.aggregate([
    {
      $match: matchQuery
    },
    {
      $lookup: {
        from: PreMarketCryptoToken.collection.name,
        localField: "offer_token",
        foreignField: "_id",
        as: "offer_token",
      },
    },
    {
      $lookup: {
        from: PreMarketCryptoToken.collection.name,
        localField: "receive_token",
        foreignField: "_id",
        as: "receive_token",
      },
    },
    {
      $lookup: {
        from: User.collection.name,
        localField: "user_id",
        foreignField: "_id",
        as: "deal_creator",
      },
    },
    {
      $lookup: {
        from: ChainList.collection.name,
        localField: "chain_id",
        foreignField: "chain_id",
        as: "chain",
      },
    },
    {
      $unwind: "$offer_token",
    },
    {
      $unwind: "$receive_token",
    },
    {
      $unwind: "$deal_creator",
    },
    {
      $unwind: "$chain",
    },
    {
      $sort: {
        _id: -1,
      },
    },
    { $skip: skip },
    { $limit: limit },
    {
      $addFields: {
        total_price: { $multiply: ["$total_token", "$price_per_token"] },
        is_tge_start: false,
        is_investment_start: false,
        is_investment_end: false,
        number_of_token_require: 0,
        deal_creator_address: "$deal_creator.primary_address",
        start_date: "$offer_token.start_date",
        end_date: "$offer_token.end_date",
        tge: "$offer_token.tge",
      },
    },
    {
      $project: {
        id: 1,
        is_settled: 1,
        total_token: 1,
        collateral_token_amount: 1,
        price_per_token: 1,
        user_id: 1,
        token_id: 1,
        total_price: 1,
        view_count: 1,
        is_untraded_claimed: 1,
        trade_type: 1,
        completion_percentage: 1,
        filled_token_amount: 1,
        available_token: 1,
        trade_index_from_blockchain: 1,
        "offer_token._id": 1,
        "offer_token.name": 1,
        "offer_token.token_image": 1,
        "offer_token.price": 1,
        "offer_token.symbol": 1,
        "offer_token.token_address": 1,
        "offer_token.number_of_decimals": 1,
        "receive_token._id": 1,
        "receive_token.name": 1,
        "receive_token.token_image": 1,
        "receive_token.price": 1,
        "receive_token.symbol": 1,
        "receive_token.token_address": 1,
        "receive_token.number_of_decimals": 1,
        number_of_token_require: 1,
        is_tge_start: 1,
        is_investment_start: 1,
        is_investment_end: 1,
        deal_creator_address: 1,
        is_distributed: 1,
        is_claimed: 1,
        start_date: 1,
        end_date: 1,
        tge: 1,
        "chain.chain_id": 1,
        "chain.name": 1,
        "chain.image": 1,
      },
    },
  ]);
  return {trades, totalTrades};
};

const increaseViewCount = async (tradeId) => {
  const trade = await PreMarketTrade.findByIdAndUpdate(tradeId, { $inc: { view_count: 1 } });
  return trade;
};


const getTradeById = async (tradeId) => {
  const trade = await PreMarketTrade.findOne({ _id: new ObjectId(tradeId), is_cancelled: false }).populate("user_id");
  return trade;
};

const cancelTrade = async (tradeId) => {
  const trade = await PreMarketTrade.findByIdAndUpdate(tradeId, { is_cancelled: true })
  return trade;
};

 



module.exports = {
  createTrade,
  updateTrade,
  getTrades,
  getUsersTrades,
  getTradeById,
  increaseViewCount,
  cancelTrade
};
