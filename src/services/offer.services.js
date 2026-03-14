const { offerStatus } = require("../config/other.constant");
const { Offers, Trades, User } = require("../models");
const { Types } = require("mongoose");
const { ObjectId } = Types;

const createOffer = async (data) => {
  const offer = await Offers.create(data);
  return offer;
};

const updateOffer = async (offerId, data) => {
  const offer = await Offers.findByIdAndUpdate(offerId, data);
  return offer;
};

const getOfferById = async (offerId) => {
  const offer = await Offers.aggregate([
    {
      $match: {
        _id: new ObjectId(offerId),
        is_deleted: false,
      },
    },
    {
      $lookup: {
        from: Trades.collection.name,
        localField: "trade_id",
        foreignField: "_id",
        as: "trade",
      },
    },
    {
      $lookup: {
        from: User.collection.name,
        localField: "trade_owner_id",
        foreignField: "_id",
        as: "trade_owner",
      },
    },
    {
      $lookup: {
        from: User.collection.name,
        localField: "user_id",
        foreignField: "_id",
        as: "offer_by",
      },
    },
    {
      $unwind: "$trade",
    },
    {
      $unwind: "$trade_owner",
    },
    {
      $unwind: "$offer_by",
    },
    {
      $project: {
        "trade_owner.wallets": 0,
        "offer_by.wallets": 0,
      },
    },
  ]);
  return offer;
};

const removeOffer = async (offerId) => {
  const offer = await Offers.findByIdAndUpdate(offerId, { is_deleted: true });
  return offer;
};

const getOffers = async (user_id) => {
  const offer = await Offers.aggregate([
    {
      $match: {
        is_deleted: false,
        trade_owner_id: new ObjectId(user_id),
      },
    },
    {
      $lookup: {
        from: Trades.collection.name,
        localField: "trade_id",
        foreignField: "_id",
        as: "trade",
      },
    },
    {
      $lookup: {
        from: User.collection.name,
        localField: "trade_owner_id",
        foreignField: "_id",
        as: "trade_owner",
      },
    },
    {
      $lookup: {
        from: User.collection.name,
        localField: "user_id",
        foreignField: "_id",
        as: "offer_by",
      },
    },
    {
      $unwind: "$trade",
    },
    {
      $unwind: "$trade_owner",
    },
    {
      $unwind: "$offer_by",
    },
    {
      $project: {
        "trade_owner.wallets": 0,
        "offer_by.wallets": 0,
      },
    },
  ]);
  return offer;
};

const acceptOffer = async (offerId) => {
  const offer = await Offers.findByIdAndUpdate(offerId, {
    is_accepted: offerStatus.ACCEPTED,
  });
  return offer;
};

const rejectOffer = async (offerId) => {
  const offer = await Offers.findByIdAndUpdate(offerId, {
    is_rejected: offerStatus.REJECTED,
  });
  return offer;
};

const countOffers = async (user_id) => {
  const count = await Offers.countDocuments({
    is_deleted: false,
    trade_owner_id: user_id,
  });
  return count;
};

const getMyProposedOffers = async (user_id) => {
  const offers = await Offers.aggregate([
    {
      $match: {
        is_deleted: false,
        user_id: new ObjectId(user_id),
      },
    },
    {
      $lookup: {
        from: Trades.collection.name,
        localField: "trade_id",
        foreignField: "_id",
        as: "trade",
      },
    },
    {
      $lookup: {
        from: User.collection.name,
        localField: "trade_owner_id",
        foreignField: "_id",
        as: "trade_owner",
      },
    },
    {
      $unwind: "$trade",
    },
    {
      $unwind: "$trade_owner",
    },
    {
      $project: {
        "trade_owner.wallets": 0,
      },
    },
  ]);
  return offers;
};

module.exports = {
  createOffer,
  updateOffer,
  getOfferById,
  removeOffer,
  getOffers,
  acceptOffer,
  rejectOffer,
  countOffers,
  getMyProposedOffers
};
