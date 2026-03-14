const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const UserModel = require('./user.model');

const notificationSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: UserModel.collection.name
    },
    message: {
      type: String,
      required: true,
    },
    mark_as_read:{
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
notificationSchema.plugin(toJSON);
notificationSchema.plugin(paginate);

/**
 * @typedef Notication
 */
const Notication = mongoose.model('notication', notificationSchema);

module.exports = Notication;
