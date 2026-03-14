const mongoose = require('mongoose');
const { toJSON } = require('../plugins');
const { tradeType, lotType } = require('../../config/other.constant');
const CryptoToken = require('./cryptotoken.model');
const UserModel = require('../user.model');


const brokerLinksSchema = mongoose.Schema(
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
    client_address: {
      type: String,
      required: true,
    },
    broker_address: {
      type: String,
      required: true,
    },
    total_token: {
      type: Number,
      required: true,
    },
    price_per_token: {
      type: Number,
      required: true,
    },
    broker_fee: {
      type: Number,
      default: 0
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
    lot_size: {
      type: Number,
      enum: lotType.values(),
      default: lotType.FULL
    },
    chain_id: {
      type: Number,
      required: true,
    },
    expire_time: {
      type: Number,
      required: true,
    },
    is_deal_created: {
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
brokerLinksSchema.plugin(toJSON);
// brokerLinksSchema.plugin(paginate);

/**
 * @typedef BrokerLinks
 */
const BrokerLinks = mongoose.model('broker_link', brokerLinksSchema);

module.exports = BrokerLinks;
