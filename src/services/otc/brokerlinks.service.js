const { tradeType } = require("../../config/other.constant");
const { BrokerLinks, CryptoToken } = require("../../models");
const { Types } = require("mongoose");
const { ObjectId } = Types;

const createLinks = async (data) => {
  const link = await BrokerLinks.create(data);
  return link;
};

const updateLinks = async (link_id, data) => {
  const link = await BrokerLinks.findByIdAndUpdate(link_id, data);
  return link;
};

const findLinkById = async (link_id) => {
  const link = await BrokerLinks.aggregate([
    {
      $match: {
        _id: new ObjectId(link_id)
      },
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
    { $unwind: "$offer_token" },
    { $unwind: "$receive_token" },
    {
      $project: {
        _id: 1,
        client_address: 1,
        offer_token: 1,
        receive_token: 1,
        broker_address: 1,
        total_token: 1,
        price_per_token: 1,
        broker_fee: 1,
        trade_type: 1,
        lot_size: 1,
        chain_id: 1,
        expire_time: 1,
        is_deal_created: 1,
      },
    }
  ]);
  return link.length > 0 ? link[0] : null;
};

const getBrokersLinksForUser = async (client_address, chain_id, limit, skip) => {
  const matchQuery = {
    client_address: client_address,
    chain_id: Number(chain_id)
  }
  const totalLinks = await BrokerLinks.countDocuments(matchQuery);
  const links = await BrokerLinks.aggregate([
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
    { $unwind: "$offer_token" },
    { $unwind: "$receive_token" },
    {
      $sort: {
        _id: -1,
      },
    },
    { $skip: skip },
    { $limit: limit },
    {
      $project: {
        _id: 1,
        client_address: 1,
        offer_token: 1,
        receive_token: 1,
        broker_address: 1,
        total_token: 1,
        price_per_token: 1,
        broker_fee: 1,
        trade_type: 1,
        lot_size: 1,
        chain_id: 1,
        expire_time: 1,
        is_deal_created: 1,
      },
    }
  ]);
  return {links, totalLinks};
};

const getBrokersLinksForBroker = async (broker_address, chain_id, limit, skip) => {

  const matchQuery = {
    broker_address: broker_address,
    chain_id: Number(chain_id)
  }
  const totalLinks = await BrokerLinks.countDocuments(matchQuery);

  const links = await BrokerLinks.aggregate([
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
    { $unwind: "$offer_token" },
    { $unwind: "$receive_token" },
    {
      $sort: {
        _id: -1,
      },
    },
    { $skip: skip },
    { $limit: limit },
    {
      $project: {
        _id: 1,
        client_address: 1,
        offer_token: 1,
        receive_token: 1,
        broker_address: 1,
        total_token: 1,
        price_per_token: 1,
        broker_fee: 1,
        trade_type: 1,
        lot_size: 1,
        chain_id: 1,
        expire_time: 1,
        is_deal_created: 1,
      },
    }
  ]);
  return {links, totalLinks};
};

module.exports = {
  createLinks,
  updateLinks,
  findLinkById,
  getBrokersLinksForUser,
  getBrokersLinksForBroker
};
