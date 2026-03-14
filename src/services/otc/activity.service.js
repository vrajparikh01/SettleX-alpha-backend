const { offerStatus } = require("../../config/other.constant");
const { Activity, Trades, CryptoToken, User } = require("../../models/index");
const { Types } = require("mongoose");
const { ObjectId } = Types;

const addActivity = async (data) => {
  const activity = await Activity.create(data);
  return activity;
};

const getActivitiesForToken = async (token_id, limit, skip) => {
  const totalActivity = await Activity.countDocuments({ token_id: ObjectId(token_id)});
  const activity = await Activity.aggregate([
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
        from: Trades.collection.name,
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
        total_price: 1
      }
    }
  ]);
  return {activity, totalActivity};
};

const getMyActivities = async (user_id, limit, skip)  => {
  const totalActivity = await Activity.countDocuments({ user_id: ObjectId(user_id)  });
  const activity = await Activity.aggregate([
    { $match: { user_id: ObjectId(user_id),  } },
    { $sort: { createdAt: -1 } },
    {
      $lookup: {
        from: User.collection.name,
        localField: "user_id",
        foreignField: "_id",
        as: "user_info",
      },
    },
    {
      $lookup: {
        from: Trades.collection.name,
        localField: "trade_id",
        foreignField: "_id",
        pipeline: [
          {
            $lookup: {
              from: CryptoToken.collection.name,
              localField: "offer_token",
              foreignField: "_id",  
              as: "offer_token",
            }
          },
          {
            $lookup: {
              from: CryptoToken.collection.name,
              localField: "receive_token",
              foreignField: "_id",  
              as: "receive_token",
            }
          },
          {
            $unwind: "$offer_token",
          },
          {
            $unwind: "$receive_token",
          },
        ],
        as: "trade",
      },
    },
    {
      $unwind: "$trade",
    },
    {
      $unwind: "$user_info",
    },
    {
      $addFields: {
        // total_price: { $multiply: ["$number_of_token", "$price_per_token"] },
        chain_id: "$user_info.primary_chain",
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
        __id: 1,
        activity_type: 1,
        chain_id: 1,
        number_of_token: 1,
        number_of_token_received: 1,
        createdAt: 1,
        transaction_hash: 1,
        "trade._id": 1,
        "trade.is_cancelled": 1,
        "trade.view_count": 1,
        "trade.total_token": 1,
        "trade.available_token": 1,
        "trade.price_per_token": 1,
        "trade.total_receive_token": 1,
        "trade.filled_token_amount": 1,
        "trade.trade_type": 1,
        "trade.completion_percentage": 1,
        "trade.offer_token._id": 1,
        "trade.offer_token.symbol": 1,
        "trade.offer_token.token_address": 1,
        "trade.offer_token.token_image": 1,
        "trade.offer_token.price": 1,
        "trade.receive_token.symbol": 1,
        "trade.receive_token._id": 1,
        "trade.receive_token.token_address": 1,
        "trade.receive_token.token_image": 1,
        "trade.receive_token.price": 1,
        // total_price: 1
      }
    }
  ]);
  return {activity, totalActivity};
};



module.exports = { addActivity, getActivitiesForToken, getMyActivities };
