const mongoose = require('mongoose');
const { toJSON, paginate } = require('../plugins');
const TradeModel = require('./trade.model');
const UserModel = require('../user.model');
const CryptoToken = require('./cryptotoken.model');
const { tradeType } = require('../../config/other.constant');


const activitySchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: UserModel.collection.name
    },
    trade_id: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: TradeModel.collection.name
    },
    from_address: {
      type: String,
      required: true,
    },
    to_address: {
      type: String,
      default: "",
      required: false,
    },
    number_of_token: {
      type: Number,
      required: true,
    },
    number_of_token_received: {
      type: Number,
      required: true,
    },
    price_per_token: {
      type: Number,
      required: true,
    },
    activity_type: {
      type: Number,
      enum: tradeType.values(),
      default: tradeType.BUY
    },
    listed_price: {
      type: Number,
      default: 0,
      required: false,
    },
    settled_price: {
      type: Number,
      default: 0,
      required: false,
    },
    is_deleted:{
      type: Boolean,
      default: false
    },
    transaction_hash: {
      type: String,
      default: "",
      required: false,
    },
    token_id: {
      type: mongoose.SchemaTypes.ObjectId,
      required: false,
      ref: CryptoToken.collection.name
    },
    chain_id: {
      type: Number,
      required: false,
    },
    createdAt: Number,
    updatedAt: Number,
  },
  {
    timestamps: { currentTime: () => Math.floor(Date.now()/1000) }
  }
);

// add plugin that converts mongoose to json
activitySchema.plugin(toJSON);
activitySchema.plugin(paginate);

/**
 * @typedef Activity
 */
const Activity = mongoose.model('activity', activitySchema);

module.exports = Activity;
