const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const { sendSuccessResponse } = require('../utils/ApiResponse');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  return sendSuccessResponse(res, 'account deleted successfully', {}, httpStatus.OK);
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.user._id, req.body);
  return sendSuccessResponse(res, 'quick update data successfully', user, httpStatus.OK);
});

// TODO: need to update price of token from coingetco api (last trade, contribution)
const getQuickUpdateData = catchAsync(async (req, res) => {
  const user = await userService.getUserByWalletAddress(req.params.wallet_address);
  if(!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  const data = await userService.getQuickUpdateData(user)
  const respose = [
    {
      type: 'received',
      message: 'Your last trade haven\'t sold yet'
    },
    {
      type: 'new_trade',
      message: 'No new trade yet'
    },
    {
      type: 'contribution',
      message: 'No contribution'
    }
  ]

  if(data.getLastReceived) {
    respose[0].message = `you received ${data.getLastReceived.number_of_token} ${data.getLastReceived.token_id.name} from the wallet id ${getFirstAndLastFourChars(data.getLastReceived.to_address)}`
  }

  if(data.getLastTrade) {
    respose[1].message = `${data.getLastTrade.total_token} ${data.getLastTrade.offer_token.name} offer for 100 ${data.getLastTrade.receive_token.name}`
  }
  
  if(data.getLastContribution) {
    respose[2].message = `you contributed ${data.getLastContribution.number_of_token} token to the ${data.getLastContribution.token_detail.name}`
  }

  return sendSuccessResponse(res, 'quick update data successfully', respose, httpStatus.OK);
});


const WhiteListWalletForPreMarket = catchAsync(async (req, res) => {
  const data = {
    primary_address: req.body.user_address,
    chain_id: req.body.chain_id,
    role: 'premarket',
  }
  let user = await userService.getUserByWalletAddressAndChainId(req.body.user_address, req.body.chain_id);
  if(!user) {
    await userService.createUser(data);
  } else {
    user = await userService.updateUserById(user._id, data);
  }
  
  res.status(httpStatus.CREATED).send(user);
});

function getFirstAndLastFourChars(str) {
  if (str.length <= 8) {
    // If the string is shorter or equal to 8 characters, return the string as is
    return str;
  }
  
  const firstFour = str.substring(0, 4); // Get the first 4 characters
  const lastFour = str.substring(str.length - 4); // Get the last 4 characters
  
  return firstFour + '...' + lastFour;
}


module.exports = {
  createUser,
  getUsers,
  getUser,
  deleteUser,
  updateUser,
  getQuickUpdateData,
  WhiteListWalletForPreMarket
};
