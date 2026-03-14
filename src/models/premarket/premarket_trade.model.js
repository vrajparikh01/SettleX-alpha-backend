const mongoose = require('mongoose');
const { toJSON, paginate } = require('../plugins');
const { lotType, tradeType } = require('../../config/other.constant');
const PreMarketCryptoToken = require('./premarketcryptotoken.model');
const UserModel = require('../user.model');


const tradeSchema = mongoose.Schema(
  {
    offer_token: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: PreMarketCryptoToken.collection.name
    },
    receive_token: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: PreMarketCryptoToken.collection.name
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: UserModel.collection.name
    },
    total_token: {
      type: Number,
      required: true,
    },
    collateral_token_amount: {
      type: Number,
      required: true,
    },
    available_token: {
      type: Number,
      required: true,
    },
    completion_percentage: {
      type: Number,
      required: false,
      default: 0
    },
    filled_token_amount: {
      type: Number,
      required: true,
      default: 0
    },
    price_per_token: {
      type: Number,
      required: true,
    },
    is_settled: {
      type: Boolean,
      default: false,
    },
    is_cancelled:{
      type: Boolean,
      default: false
    },
    trade_index_from_blockchain: {
      type: Number,
      required: true,
    },
    trade_hash_from_blockchain: {
      type: String,
      required: true,
    },
    chain_id: {
      type: Number,
      required: true,
    },
    view_count: {
      type: Number,
      required: false,
      default: 0
    },
    is_deleted:{
      type: Boolean,
      default: false
    },
    is_distributed:{
      type: Boolean,
      default: false
    },
    is_claimed:{
      type: Boolean,
      default: false
    },
    is_untraded_claimed:{
      type: Boolean,
      default: false
    },
    trade_type: {
      type: Number,
      enum: tradeType.values(),
      default: tradeType.BUY
    },
    createdAt: Number,
    updatedAt: Number,
  },
  {
    timestamps: { currentTime: () => Math.floor(Date.now()/1000) }
  }
);

// add plugin that converts mongoose to json
tradeSchema.plugin(toJSON);
// tradeSchema.plugin(paginate);

/**
 * @typedef PreMarketTrade
 */
const PreMarketTrade = mongoose.model('premarket_trade', tradeSchema);

module.exports = PreMarketTrade;
