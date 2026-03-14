const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const cryptoTokenModel = require('./otc/cryptotoken.model');
const UserModel = require('./user.model');


const portfolioSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: UserModel.collection.name
    },
    token_id: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: cryptoTokenModel.collection.name
    },
    token_amount: {
      type: Number,
      required: true,
    },
    invested_amount: {
      type: Number,
      required: true,
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
portfolioSchema.plugin(toJSON);
portfolioSchema.plugin(paginate);

/**
 * @typedef Portfolio
 */
const Portfolio = mongoose.model('portfolio', portfolioSchema);

module.exports = Portfolio;
