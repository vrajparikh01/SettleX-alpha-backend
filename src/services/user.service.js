const httpStatus = require('http-status');
const { User, Activity, Trades, CryptoToken } = require('../models');
const ApiError = require('../utils/ApiError');
const { tradeType } = require('../config/other.constant');


/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return User.findById(id).lean();
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await User.findByIdAndUpdate(userId, { $set: {is_deleted: true} });
  return user;
};


const getUserByWalletAddress = async (address) => {
  return User.findOne({ primary_address: address });
};

const getUserByWalletAddressAndChainId = async (address, chainId) => {
  return User.findOne({ primary_address: address, primary_chain: chainId});
};


const createUser = async (userBody) => {
  return User.create(userBody);
};



const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  const userUpdated = await User.findByIdAndUpdate(userId, updateBody);
  return userUpdated;
};

const getQuickUpdateData = async (userInfo) => {
  const getLastContribution = await Activity.aggregate([
    {
      $match: {user_id: userInfo._id, activity_type: tradeType.BUY}
    },
    {
      $lookup: {
        from: CryptoToken.collection.name,
        localField: "token_id",
        foreignField: "_id",
        as: "token_detail",
      },
    },
    {
      $unwind: "$token_detail"
    },
    {
      $sort: {_id: -1}
    },
    {
      $limit: 1
    }
  ])

  
  const getLastReceived = await Activity.findOne({user_id: userInfo._id, activity_type: tradeType.SELL}).populate('token_id').sort({_id: -1})

  const getLastTrade = await Trades.aggregate([
    {
      $match: { user_id: {$ne: userInfo._id}, is_settled: false, is_cancelled: false }
    },
    {
      $lookup: {
        from: CryptoToken.collection.name,
        localField: "offer_token",
        foreignField: "_id",
        as: "offer_token",
      },
    },
    {
      $lookup: {
        from: CryptoToken.collection.name,
        localField: "receive_token",
        foreignField: "_id",
        as: "receive_token",
      },
    },
    {
      $unwind: "$offer_token"
    },
    {
      $unwind: "$receive_token"
    },
    {
      $sort: {_id: -1}
    },
    {
      $limit: 1
    }
  ])
  
  return {getLastTrade: getLastTrade[0], getLastContribution: getLastContribution[0], getLastReceived}
}


module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  deleteUserById,
  getUserByWalletAddress,
  getUserByWalletAddressAndChainId,
  updateUserById,
  getQuickUpdateData,
};
