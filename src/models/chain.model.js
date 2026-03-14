const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');


const chainSchema = mongoose.Schema(
  {
    chain_id: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    image: {
      type: String,
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
chainSchema.plugin(toJSON);
chainSchema.plugin(paginate);

/**
 * @typedef ChainList
 */
const ChainList = mongoose.model('chain', chainSchema);

module.exports = ChainList;
