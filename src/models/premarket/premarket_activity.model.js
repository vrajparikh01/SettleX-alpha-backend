const mongoose = require('mongoose');
const { toJSON, paginate } = require('../plugins');
const PreMarketTradeModel = require('./premarket_trade.model');
const UserModel = require('../user.model');
const PreMarketTokenController = require('./premarketcryptotoken.model');
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
      ref: PreMarketTradeModel.collection.name
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
    invest_token_amount: {
      type: Number,
      required: true,
    },
    claim_token_amount: {
      type: Number,
      required: true,
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
      ref: PreMarketTokenController.collection.name
    },
    is_claimed:{
      type: Boolean,
      default: false
    },
    is_distributed:{
      type: Boolean,
      default: false
    },
    wallet_address:{
      type: String,
      default: false
    },
    chain_id: {
      type: Number,
      required: true
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
 * @typedef PreMarketActivity
 */
const PreMarketActivity = mongoose.model('premarket_activity', activitySchema);

module.exports = PreMarketActivity;
