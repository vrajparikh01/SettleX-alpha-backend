const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
      trim: true,
    },
    email: {
      type: String,
      default: "",
      required: false,
      lowercase: true,
    },
    role: {
      type: String,
      enum: roles,
      default: 'user',
    },
    primary_address: {
      type: String,
    },
    primary_chain: {
      type: Number,
      default: 1
    },
    telegram: {
      type: String,
      default: "",
    },
    discord: {
      type: String,
      default: "",
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
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

/**
 * @typedef User
 */
const User = mongoose.model('users', userSchema);

module.exports = User;
