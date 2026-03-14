const mongoose = require('mongoose');
const { toJSON, paginate } = require('../plugins');
const { PremaketTokenType } = require('../../config/other.constant');

const cryptoTokenSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    symbol: {
      type: String,
      required: true,
      trim: true,
    },
    chain_id: {
      type: Number,
      required: true,
    },
    token_address: {
      type: String,
      unique: true,
      required: true,
    },
    description: {
      type: String,
      default: "",
      required: false,
    },
    tge: {
      type: Number,
      required: false,
      default: 0
    },
    start_date: {
      type: Number,
      required: false,
      default: 0
    },
    end_date: {
      type: Number,
      required: false,
      default: 0
    },
    is_deleted:{
      type: Boolean,
      default: false
    },
    token_image: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      default: 0
    },
    number_of_round: {
      type: Number,
      default: 0
    },
    vesting_summary: {
      type: String,
      default: ""
    },
    fully_diluted_valuation: {
      type: Number,
      default: 0
    },
    number_of_decimals: {
      type: Number,
      default: 18
    },
    token_type: {
      type: Number,
      default: PremaketTokenType.NORMAL,
      enum: PremaketTokenType.values()
    },
    createdAt: Number,
    updatedAt: Number,
  },
  {
    timestamps: { currentTime: () => Math.floor(Date.now()/1000) }
  }
);

// add plugin that converts mongoose to json
cryptoTokenSchema.plugin(toJSON);
cryptoTokenSchema.plugin(paginate);

/**
 * @typedef PreMarketCryptoToken
 */
const PreMarketCryptoToken = mongoose.model('pre_market_crypto_tokens', cryptoTokenSchema);

module.exports = PreMarketCryptoToken;
