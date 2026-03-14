const { tradeType } = require("../../config/other.constant");
const { Trades, CryptoToken, Activity } = require("../../models");
const { Types } = require("mongoose");
const { ObjectId } = Types;

const createTrade = async (data) => {
  const trade = await Trades.create(data);
  return trade;
};

const updateTrade = async (tradeId, data) => {
  const trade = await Trades.findByIdAndUpdate(tradeId, data);
  return trade;
};

function isEmpty(obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}

const getTrades = async (
  skip,
  limit,
  type,
  name,
  chain_id,
  search_with_amount
) => {
  let matchQuery = {
    is_deleted: false,
    // is_settled: false,
    // is_cancelled: false,
    is_broker: false,
    // user_id: {$ne: new ObjectId(user_id)},
  };

  if (type !== "all") {
    matchQuery.trade_type = type == "buy" ? 0 : 1;
  }

  if (chain_id) {
    Object.assign(matchQuery, { chain_id: Number(chain_id) });
  }

  if (name) {
    matchQuery.$or = [];
    const tokens = await CryptoToken.find({
      $or: [
        { name: { $regex: name, $options: "i" } },
        { name: { $regex: name, $options: "i" } },
      ],
    });
    const tokenIds = tokens.map((token) => token._id);
    matchQuery.$or.push({ offer_token: { $in: tokenIds } });
    matchQuery.$or.push({ receive_token: { $in: tokenIds } });
  }

  if (!isEmpty(search_with_amount)) {
    const amountConditions = [
      { offer_token: new ObjectId(search_with_amount.offer_token) },
      // { total_token: Number(search_with_amount.offer_token_amount) },
      { receive_token: new ObjectId(search_with_amount.receive_token) },
      // { total_receive_token: Number(search_with_amount.receive_token_amount) },
    ];

    if (!matchQuery.$and) {
      matchQuery.$and = amountConditions;
    } else {
      matchQuery.$and.push(...amountConditions);
    }
  }

  const totalTrades = await Trades.countDocuments(matchQuery);

  const trades = await Trades.aggregate([
    {
      $match: matchQuery,
    },
    {
      $lookup: {
        from: CryptoToken.collection.name,
        localField: "offer_token",
        foreignField: "_id",
        as: "offer_token",
      },
    },
    {
      $lookup: {
        from: CryptoToken.collection.name,
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
        price_in_x: 0,
        number_of_token_require: 0,
        trade_type: {
          $cond: {
            if: { $eq: ["$trade_type", 0] },
            then: 1,
            else: 0,
          },
        },
      },
    },
    {
      $project: {
        is_settled: 1,
        trade_type: 1,
        receiver_wallet_address: 1,
        is_deleted: 1,
        total_token: 1,
        price_per_token: 1,
        user_id: 1,
        lot_size: 1,
        token_id: 1,
        id: 1,
        total_price: 1,
        view_count: 1,
        completion_percentage: 1,
        filled_token_amount: 1,
        available_token: 1,
        trade_index_from_blockchain: 1,
        trade_hash_from_blockchain: 1,
        "offer_token._id": 1,
        "offer_token.name": 1,
        "offer_token.price": 1,
        "offer_token.symbol": 1,
        "offer_token.token_image": 1,
        "offer_token.token_address": 1,
        "offer_token.number_of_decimals": 1,
        "receive_token._id": 1,
        "receive_token.name": 1,
        "receive_token.price": 1,
        "receive_token.token_image": 1,
        "receive_token.symbol": 1,
        "receive_token.token_address": 1,
        "receive_token.number_of_decimals": 1,
        price_in_x: 1,
        number_of_token_require: 1,
      },
    },
  ]);
  return { trades, totalTrades };
};

const getTokensTrades = async (token_id, skip, limit, type) => {
  let matchQuery = {
    is_deleted: false,
    $or: [
      { offer_token: new ObjectId(token_id) },
      { receive_token: new ObjectId(token_id) },
    ],
    is_settled: false,
    is_cancelled: false,
    is_broker: false,
    user_id: { $ne: new ObjectId(user_id) },
  };

  if (type !== "all") {
    matchQuery.trade_type = type == "buy" ? 1 : 0;
  }

  const totalTrades = await Trades.countDocuments(matchQuery);

  const trades = await Trades.aggregate([
    {
      $match: matchQuery,
    },
    {
      $lookup: {
        from: CryptoToken.collection.name,
        localField: "offer_token",
        foreignField: "_id",
        as: "offer_token",
      },
    },
    {
      $lookup: {
        from: CryptoToken.collection.name,
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
    {
      $addFields: {
        total_price: { $multiply: ["$total_token", "$price_per_token"] },
        price_in_x: 0,
        number_of_token_require: 0,
        trade_type: {
          $cond: {
            if: { $eq: ["$trade_type", 0] },
            then: 1,
            else: 0,
          },
        },
      },
    },
    { $skip: skip },
    { $limit: limit },
    {
      $sort: {
        _id: -1,
      },
    },
    {
      $project: {
        is_settled: 1,
        trade_type: 1,
        wallet_address: 1,
        is_deleted: 1,
        total_token: 1,
        price_per_token: 1,
        user_id: 1,
        token_id: 1,
        lot_size: 1,
        id: 1,
        total_price: 1,
        view_count: 1,
        completion_percentage: 1,
        receiver_wallet_address: 1,
        filled_token_amount: 1,
        number_of_token_require: 1,
        available_token: 1,
        trade_index_from_blockchain: 1,
        trade_hash_from_blockchain: 1,
        "offer_token.name": 1,
        "offer_token.price": 1,
        "offer_token.symbol": 1,
        "offer_token.token_address": 1,
        "offer_token.number_of_decimals": 1,
        "receive_token.name": 1,
        "receive_token.price": 1,
        "receive_token.symbol": 1,
        "receive_token.token_address": 1,
        "receive_token.number_of_decimals": 1,
        price_in_x: 1,
      },
    },
  ]);
  return { trades, totalTrades };
};

const cancelTrade = async (tradeId) => {
  const trade = await Trades.findByIdAndUpdate(tradeId, { is_cancelled: true });
  return trade;
};

const increaseViewCount = async (tradeId) => {
  const trade = await Trades.findByIdAndUpdate(tradeId, {
    $inc: { view_count: 1 },
  });
  return trade;
};

const getTradeById = async (tradeId) => {
  const trade = await Trades.findOne({ _id: tradeId, is_deleted: false });
  return trade;
};

const getBrokersTrades = async (skip, limit, type, name, chain_id) => {
  let matchQuery = {
    is_deleted: false,
    // is_settled: false,
    is_cancelled: false,
    is_broker: true,
    // user_id: {$ne: new ObjectId(user_id)},
  };

  if (type !== "all") {
    matchQuery.trade_type = type == "buy" ? 0 : 1;
  }

  if (chain_id) {
    Object.assign(matchQuery, { chain_id: Number(chain_id) });
  }

  if (name) {
    matchQuery.$or = [];
    const tokens = await CryptoToken.find({
      name: { $regex: name, $options: "i" },
    });
    const tokenIds = tokens.map((token) => token._id);
    matchQuery.$or.push({ offer_token: { $in: tokenIds } });
    matchQuery.$or.push({ receive_token: { $in: tokenIds } });
  }

  const totalTrades = await Trades.countDocuments(matchQuery);

  const trades = await Trades.aggregate([
    {
      $match: matchQuery,
    },
    {
      $lookup: {
        from: CryptoToken.collection.name,
        localField: "offer_token",
        foreignField: "_id",
        as: "offer_token",
      },
    },
    {
      $lookup: {
        from: CryptoToken.collection.name,
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
        price_in_x: 0,
        number_of_token_require: 0,
        trade_type: {
          $cond: {
            if: { $eq: ["$trade_type", 0] },
            then: 1,
            else: 0,
          },
        },
      },
    },
    {
      $project: {
        is_settled: 1,
        trade_type: 1,
        wallet_address: 1,
        is_deleted: 1,
        total_token: 1,
        price_per_token: 1,
        user_id: 1,
        lot_size: 1,
        token_id: 1,
        id: 1,
        total_price: 1,
        view_count: 1,
        completion_percentage: 1,
        filled_token_amount: 1,
        receiver_wallet_address: 1,
        available_token: 1,
        trade_index_from_blockchain: 1,
        trade_hash_from_blockchain: 1,
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
        "receive_token.token_image": 1,
        "receive_token.symbol": 1,
        "receive_token.token_address": 1,
        "receive_token.number_of_decimals": 1,
        price_in_x: 1,
        number_of_token_require: 1,
      },
    },
  ]);
  return { trades, totalTrades };
};

const getUserSpecificTrades = async (user_id, skip, limit, type, chain_id) => {
  let matchQuery = {
    is_deleted: false,
    // is_settled: false,
    // is_broker: false,
    // is_cancelled: false,
    user_id: new ObjectId(user_id),
  };

  if (chain_id) {
    Object.assign(matchQuery, { chain_id: Number(chain_id) });
  }

  if (type !== "all") {
    matchQuery.trade_type = type == "buy" ? 1 : 0;
  }

  const totalTrades = await Trades.countDocuments(matchQuery);

  const trades = await Trades.aggregate([
    {
      $match: matchQuery,
    },
    {
      $lookup: {
        from: CryptoToken.collection.name,
        localField: "offer_token",
        foreignField: "_id",
        as: "offer_token",
      },
    },
    {
      $lookup: {
        from: CryptoToken.collection.name,
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
    {
      $addFields: {
        total_price: { $multiply: ["$total_token", "$price_per_token"] },
        price_in_x: 0,
        number_of_token_require: 0,
        trade_type: {
          $cond: {
            if: { $eq: ["$trade_type", 0] },
            then: 1,
            else: 0,
          },
        },
      },
    },
    {
      $sort: {
        _id: -1,
      },
    },
    { $skip: skip },
    { $limit: limit },
    {
      $project: {
        is_settled: 1,
        trade_type: 1,
        receiver_wallet_address: 1,
        is_deleted: 1,
        total_token: 1,
        price_per_token: 1,
        user_id: 1,
        lot_size: 1,
        token_id: 1,
        id: 1,
        total_price: 1,
        view_count: 1,
        completion_percentage: 1,
        filled_token_amount: 1,
        available_token: 1,
        trade_index_from_blockchain: 1,
        trade_hash_from_blockchain: 1,
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
        "receive_token.token_image": 1,
        "receive_token.token_address": 1,
        "receive_token.number_of_decimals": 1,
        price_in_x: 1,
        number_of_token_require: 1,
      },
    },
  ]);
  return { trades, totalTrades };
};

// TODO: Logic need to be changes as per client requirement
const getMostActiveTrades = async (chain_id) => {
  const matchQuery = {
    is_deleted: false,
  };

  if (chain_id) {
    Object.assign(matchQuery, { chain_id: Number(chain_id) });
  }

  const activeTrades = await CryptoToken.aggregate([
    {
      $match: matchQuery,
    },
    {
      $lookup: {
        from: Trades.collection.name,
        let: { token_id: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$is_deleted", false] },
                  { $eq: ["$is_settled", false] },
                  { $eq: ["$is_cancelled", false] },
                  {
                    $or: [
                      { $eq: ["$offer_token", "$$token_id"] },
                      { $eq: ["$receive_token", "$$token_id"] },
                    ],
                  },
                ],
              },
            },
          },
          {
            $group: {
              _id: null,
              view_counts: { $sum: "$view_count" },
            },
          },
        ],
        as: "trades",
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        symbol: 1,
        token_image: 1,
        view_counts: { $arrayElemAt: ["$trades.view_counts", 0] },
      },
    },
    {
      $sort: { view_counts: -1 }, // Sorting by view_counts in descending order
    },
    {
      $limit: 3,
    },
  ]);

  return activeTrades;
};

// TODO: Logic need to be changes as per client requirement
const getMostHotSellingTrades = async (chain_id) => {
  const matchQuery = {
    is_deleted: false,
  };

  if (chain_id) {
    Object.assign(matchQuery, { chain_id: Number(chain_id) });
  }

  const activeTrades = await CryptoToken.aggregate([
    {
      $match: matchQuery,
    },
    {
      $lookup: {
        from: Trades.collection.name,
        let: { token_id: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$is_deleted", false] },
                  { $eq: ["$is_settled", false] },
                  { $eq: ["$is_cancelled", false] },
                  {
                    $or: [
                      { $eq: ["$offer_token", "$$token_id"] },
                      { $eq: ["$receive_token", "$$token_id"] },
                    ],
                  },
                ],
              },
            },
          },
          {
            $group: {
              _id: null,
              view_counts: { $sum: "$view_count" },
            },
          },
        ],
        as: "trades",
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        symbol: 1,
        token_image: 1,
        view_counts: { $arrayElemAt: ["$trades.view_counts", 0] },
      },
    },
    {
      $sort: { view_counts: -1 }, // Sorting by view_counts in descending order
    },
    {
      $limit: 3,
    },
  ]);

  return activeTrades;
};

// TODO: Who has most activity
const getTopTredingTrades = async (chain_id) => {
  const matchQuery = {
    is_deleted: false,
  };

  if (chain_id) {
    Object.assign(matchQuery, { chain_id: Number(chain_id) });
  }

  const activeTrades = await Activity.aggregate([
    {
      $match: matchQuery,
    },
    {
      $lookup: {
        from: CryptoToken.collection.name,
        localField: "token_id",
        foreignField: "_id",
        as: "tokenDetails",
      },
    },
    {
      $unwind: "$tokenDetails",
    },
    {
      $group: {
        _id: "$token_id",
        view_counts: { $sum: 1 },
        name: { $first: "$tokenDetails.name" },
        symbol: { $first: "$tokenDetails.symbol" },
        token_image: { $first: "$tokenDetails.token_image" },
      },
    },
    {
      $sort: { view_counts: -1 },
    },
    {
      $limit: 3,
    },
    {
      $project: {
        _id: 1,
        view_counts: 1,
        name: 1,
        symbol: 1,
        token_image: 1,
      },
    },
  ]);
  return activeTrades;
};

module.exports = {
  createTrade,
  updateTrade,
  getTrades,
  getTradeById,
  getTokensTrades,
  cancelTrade,
  increaseViewCount,
  getBrokersTrades,
  getUserSpecificTrades,
  getMostActiveTrades,
  getMostHotSellingTrades,
  getTopTredingTrades,
};
