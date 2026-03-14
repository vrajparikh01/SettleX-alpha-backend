const httpStatus = require('http-status');
const ApiError = require('../../utils/ApiError');
const { sendSuccessResponse } = require('../../utils/ApiResponse');
const catchAsync = require('../../utils/catchAsync');
const { activityService, tradesService, portfolioService, userService } = require('../../services/index');
const { offerStatus, tradeType } = require('../../config/other.constant');

// TODO: when offer comes need to add listed_price and settled_price (find from offer model) 
const addActivity = catchAsync(async (req, res) => {
  const getCurrentUser = await userService.getUserByWalletAddressAndChainId(req.body.current_wallet_address, req.body.chain_id);
  if(!getCurrentUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const findTradeById = await tradesService.getTradeById(req.body.trade_id);
  if (!findTradeById) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Trade not found');
  }

  const total_token = findTradeById.total_token;
  const remainingToken = findTradeById.available_token - req.body.number_of_token;
  const filled_token_amount = findTradeById.filled_token_amount + req.body.number_of_token;

  const completion_percentage = (filled_token_amount * 100) / total_token

  if(remainingToken == 0) {
    await tradesService.updateTrade(req.body.trade_id, { is_settled: true, available_token: remainingToken, completion_percentage: completion_percentage, filled_token_amount:  filled_token_amount});
  } else {
    await tradesService.updateTrade(req.body.trade_id, { available_token: remainingToken, completion_percentage: completion_percentage, filled_token_amount:  filled_token_amount });
  }

  // // portfolio update for buyer
  // const findportfolio = await portfolioService.findTokenInPortfolio(findTradeById.offer_token, findTradeById.user_id);
  // await portfolioService.updatePortfolio(findportfolio._id, { token_amount: remainingToken, invested_amount: findTradeById.price_per_token * remainingToken });

    req.body.token_id = req.body.activity_type == tradeType.BUY ? findTradeById.offer_token : findTradeById.receive_token;
    req.body.user_id = getCurrentUser._id;
    req.body.activity_type = req.body.activity_type;
    await activityService.addActivity(req.body);

    // req.body.user_id = findTradeById.user_id;
    // req.body.token_id = req.body.activity_type == tradeType.SELL ? findTradeById.receive_token : findTradeById.offer_token;
    // req.body.activity_type = tradeType.SELL;
    // await activityService.addActivity(req.body);

  return sendSuccessResponse(res, 'activity created successfully', {}, httpStatus.CREATED);
});

const getActivitiesForToken = catchAsync(async (req, res) => {
  const limit = 10;
  const page = req.query?.page || 1;
  const skip = (page - 1) * limit;

  const activities = await activityService.getActivitiesForToken(req.params.token_id, limit, skip);
  return sendSuccessResponse(res, 'token\'s activity list retrived successfully', activities, httpStatus.OK);
});

const getUsersActivities = catchAsync(async (req, res) => {

  const getCurrentUser = await userService.getUserByWalletAddressAndChainId(req.params.wallet_address, req.query.chain_id);
  if(!getCurrentUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  const limit = 10;
  const page = req.query?.page || 1;
  const skip = (page - 1) * limit;

  const activities = await activityService.getMyActivities(getCurrentUser._id, limit, skip);

  return sendSuccessResponse(res, 'user\'s activity retrived successfully', activities, httpStatus.OK);
});


module.exports = {
  addActivity,
  getActivitiesForToken,
  getUsersActivities
};
