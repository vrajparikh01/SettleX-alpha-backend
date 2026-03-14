const {
  PreMarketActivity,
  PreMarketTrade,
  User,
  PreMarketCryptoToken,
  ChainList,
} = require("../../models/index");
const { Types } = require("mongoose");
const { ObjectId } = Types;

const addActivity = async (data) => {
  const activity = await PreMarketActivity.create(data);
  return activity;
};

const getActivitiesForToken = async (token_id, limit, skip) => {
  const totalActivity = await PreMarketActivity.countDocuments({
    token_id: ObjectId(token_id),
  });
  const activity = await PreMarketActivity.aggregate([
    { $match: { token_id: ObjectId(token_id) } },
    { $sort: { createdAt: -1 } },
    {
      $lookup: {
        from: User.collection.name,
        localField: "user_id",
        foreignField: "_id",
        as: "to_user",
      },
    },
    {
      $lookup: {
        from: PreMarketTrade.collection.name,
        localField: "trade_id",
        foreignField: "_id",
        pipeline: [
          {
            $lookup: {
              from: User.collection.name,
              localField: "user_id",
              foreignField: "_id",
              as: "owner",
            },
          },
          {
            $unwind: "$owner",
          },
        ],
        as: "trade",
      },
    },
    {
      $unwind: "$trade",
    },
    {
      $unwind: "$to_user",
    },
    {
      $addFields: {
        total_price: { $multiply: ["$number_of_token", "$price_per_token"] },
      },
    },
    { $skip: skip },
    { $limit: limit },
    {
      $project: {
        __id: 1,
        activity_type: 1,
        from_address: 1,
        to_address: 1,
        trade_id: 1,
        number_of_token: 1,
        price_per_token: 1,
        listed_price: 1,
        settled_price: 1,
        createdAt: 1,
        transaction_hash: 1,
        user_id: 1,
        "trade.is_settled": 1,
        "trade._id": 1,
        "trade.is_cancelled": 1,
        "trade.user_id": 1,
        "trade.trade_type": 1,
        "to_user.name": 1,
        "to_user.discord": 1,
        "to_user.telegram": 1,
        "trade.owner.name": 1,
        "trade.owner.discord": 1,
        "trade.owner.telegram": 1,
        total_price: 1,
      },
    },
  ]);
  return { activity, totalActivity };
};

const addInvestment = async (data) => {
  const investment = await PreMarketActivity.create(data);
  return investment;
};

const getInvestments = async (skip, limit, user_id, chain_id) => {

  let matchQuery = {
    user_id: user_id,
    // is_claimed: false,
  };

  if (chain_id) {
    Object.assign(matchQuery, { chain_id: Number(chain_id) });
  }

  const totalTrades = await PreMarketActivity.countDocuments(matchQuery);

  const trades = await PreMarketActivity.aggregate([
    {
      $match: matchQuery,
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
      $lookup: {
        from: PreMarketTrade.collection.name,
        let: { trade_id: "$trade_id" },
        pipeline: [
          {
            $match: { $expr: { $eq: ["$_id", "$$trade_id"] } },
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
            $unwind: "$offer_token",
          },
          {
            $unwind: "$receive_token",
          },
        ],
        as: "trade_info",
      },
    },
    {
      $unwind: "$trade_info",
    },
    {
      $unwind: "$chain",
    },
    { $skip: skip },
    { $limit: limit },
    {
      $sort: {
        _id: -1,
      },
    },
    {
      $addFields: {
        total_price: {
          $multiply: ["$trade_info.total_token", "$trade_info.price_per_token"],
        },
        is_tge_start: false,
        is_investment_start: false,
        is_investment_end: false,
        number_of_token_require: "$trade_info.collateral_token_amount",
        start_date: "$trade_info.offer_token.start_date",
        end_date: "$trade_info.offer_token.end_date",
        tge: "$trade_info.offer_token.tge",
      },
    },
    {
      $project: {
        _id: 1,
        invest_token_amount: 1,
        claim_token_amount: 1,
        is_claimed: 1,
        is_distributed: 1,
        number_of_token_require: 1,
        "trade_info._id": 1,
        "trade_info.completion_percentage": 1,
        "trade_info.total_token": 1,
        "trade_info.price_per_token": 1,
        "trade_info.collateral_token_amount": 1,
        "trade_info.trade_type": 1,
        "trade_info.trade_index_from_blockchain": 1,
        "trade_info.offer_token.name": 1,
        "trade_info.offer_token.symbol": 1,
        "trade_info.offer_token.number_of_decimals": 1,
        "trade_info.offer_token.token_address": 1,
        "trade_info.offer_token.token_image": 1,
        "trade_info.receive_token.name": 1,
        "trade_info.receive_token.symbol": 1,
        "trade_info.receive_token.token_image": 1,
        "trade_info.receive_token.number_of_decimals": 1,
        "trade_info.receive_token.token_address": 1,
        is_tge_start: 1,
        is_investment_start: 1,
        is_investment_end: 1,
        "trade_info.is_distributed": 1,
        start_date: 1,
        end_date: 1,
        tge: 1,
        "chain.chain_id": 1,
        "chain.name": 1,
        "chain.image": 1,
      },
    },
  ]);

  return { trades, totalTrades };
};

const updateInvestment = async (id, data) => {
  const investment = await PreMarketActivity.findByIdAndUpdate(id, data);
  return investment;
};

const findInvestment = async (user_id, chain_id, id) => {
  const investment = await PreMarketActivity.findOne({
    user_id,
    chain_id,
    _id: new ObjectId(id),
  });
  return investment;
};

module.exports = {
  addActivity,
  getActivitiesForToken,
  addInvestment,
  getInvestments,
  updateInvestment,
  findInvestment,
};
