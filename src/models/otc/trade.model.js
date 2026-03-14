const mongoose = require('mongoose');
const { toJSON, paginate } = require('../plugins');
const { tradeType, lotType } = require('../../config/other.constant');
const CryptoToken = require('./cryptotoken.model');
const UserModel = require('../user.model');


const tradeSchema = mongoose.Schema(
  {
    offer_token: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: CryptoToken.collection.name
    },
    receive_token: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: CryptoToken.collection.name
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: UserModel.collection.name
    },
    receiver_wallet_address: {
      type: String,
      required: true,
    },
    total_token: {
      type: Number,
      required: true,
    },
    total_receive_token: {
      type: Number,
      required: true,
    },
    available_token: {
      type: Number,
      required: true,
    },
    price_per_token: {
      type: Number,
      required: true,
    },
    is_settled: {
      type: Boolean,
      default: false,
    },
    trade_type: {
      type: Number,
      enum: tradeType.values(),
      default: tradeType.BUY
    },
    is_deleted:{
      type: Boolean,
      default: false
    },
    is_cancelled:{
      type: Boolean,
      default: false
    },
    lot_size: {
      type: Number,
      enum: lotType.values(),
      default: lotType.FULL
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
    is_broker: {
      type: Boolean,
      default: false
    },
    broker_fee: {
      type: Number,
      default: 0
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
 * @typedef Trade
 */
const Trade = mongoose.model('trade', tradeSchema);

module.exports = Trade;
