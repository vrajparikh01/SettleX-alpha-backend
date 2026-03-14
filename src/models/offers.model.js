const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const TradeModel = require('./otc/trade.model');
const UserModel = require('./user.model');
const { offerStatus } = require('../config/other.constant');

const offerSchema = mongoose.Schema(
  {
    trade_id: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: TradeModel.collection.name
    },
    user_id: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: UserModel.collection.name
    },
    trade_owner_id: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: UserModel.collection.name
    },
    number_of_token: {
      type: Number,
      required: true,
    },
    price_per_token: {
      type: Number,
      required: true,
    },
    is_accepted: {
      type: Number,
      enum: offerStatus.values(),
      default: offerStatus.PENDING
    },
    is_deleted:{
      type: Boolean,
      default: false
    },
    createdAt: Number,
    updatedAt: Number,
  },
  {
    timestamps: { currentTime: () => Math.floor(Date.now()/1000) }
  }
);

// add plugin that converts mongoose to json
offerSchema.plugin(toJSON);
offerSchema.plugin(paginate);

/**
 * @typedef Offer
 */
const Offer = mongoose.model('offer', offerSchema);

module.exports = Offer;
