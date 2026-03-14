const httpStatus = require('http-status');
const ApiError = require('../../utils/ApiError');
const { sendSuccessResponse } = require('../../utils/ApiResponse');
const catchAsync = require('../../utils/catchAsync');
const { preMarketActivityService, preMarketTradeService, portfolioService, userService } = require('../../services/index');
const { tradeType } = require('../../config/other.constant');

// TODO: when offer comes need to add listed_price and settled_price (find from offer model) 
const addActivity = catchAsync(async (req, res) => {
  const getCurrentUser = await userService.getUserByWalletAddress(req.body.current_wallet_address);
  if(!getCurrentUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const findTradeById = await preMarketTradeService.getTradeById(req.body.trade_id);
  if (!findTradeById) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Trade not found');
  }

  const total_token = findTradeById.total_token;
  const remainingToken = (findTradeById.available_token - req.body.number_of_token) || 0;
  const filled_token_amount = findTradeById.filled_token_amount + req.body.number_of_token;

  const completion_percentage = (filled_token_amount * 100) / total_token

  if(remainingToken == 0) {
    await preMarketTradeService.updateTrade(req.body.trade_id, { is_settled: true, available_token: 0, completion_percentage: completion_percentage, filled_token_amount:  filled_token_amount});
  } else {
    await preMarketTradeService.updateTrade(req.body.trade_id, { available_token: remainingToken, completion_percentage: completion_percentage, filled_token_amount:  filled_token_amount });
  }

  // // portfolio update for buyer
  // const findportfolio = await portfolioService.findTokenInPortfolio(findTradeById.offer_token, findTradeById.user_id);
  // await portfolioService.updatePortfolio(findportfolio._id, { token_amount: remainingToken, invested_amount: findTradeById.price_per_token * remainingToken });


    req.body.token_id = findTradeById.offer_token;
    req.body.wallet_address = req.body.current_wallet_address
    req.body.user_id = getCurrentUser._id;
    await preMarketActivityService.addActivity(req.body);

    // req.body.user_id = findTradeById.user_id;
    // req.body.token_id = findTradeById.receive_token;
    // await preMarketActivityService.addActivity(req.body);

  return sendSuccessResponse(res, 'activity created successfully', {}, httpStatus.CREATED);
});

const getActivitiesForToken = catchAsync(async (req, res) => {
  const limit = 10;
  const page = req.query?.page || 1;
  const skip = (page - 1) * limit;

  const activities = await preMarketActivityService.getActivitiesForToken(req.params.token_id, limit, skip);
  return sendSuccessResponse(res, 'activity list retrived successfully', activities, httpStatus.OK);
});


const getInvestments = catchAsync(async (req, res) => {
  const limit = 10;
  const page = req.query?.page || 1;
  const skip = (page - 1) * limit;

  const chain_id = req.query?.chain_id;
  const currentTime = Math.floor(Date.now()/1000);

  const userInfo = await userService.getUserByWalletAddress(req.params.wallet_address);
  if(!userInfo) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const {trades, totalTrades} = await preMarketActivityService.getInvestments(skip, limit, userInfo._id, chain_id);
  trades.forEach((trade) => {
    trade.trade_info.is_tge_start = trade.trade_info.offer_token.tge < currentTime;
    trade.trade_info.is_investment_start = trade.trade_info.offer_token.start_date < currentTime;
    trade.trade_info.is_investment_end = trade.trade_info.offer_token.end_date < currentTime;
    return trade
  })

  return sendSuccessResponse(res, 'investment list retrived successfully', {trades, totalTrades}, httpStatus.OK);
});

const claimInvestment = catchAsync(async (req, res) => {

  const userInfo = await userService.getUserByWalletAddress(req.body.wallet_address);
  if(!userInfo) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const findInvestmentById = await preMarketActivityService.findInvestment(userInfo._id, req.body.chain_id, req.params.investment_id);
  if (!findInvestmentById) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Investment not found');
  }

  const investment = await preMarketActivityService.updateInvestment(req.params.investment_id, { is_claimed: req.body.is_claimed, is_distributed: req.body.is_distributed });
  return sendSuccessResponse(res, 'investment claimed successfully', investment, httpStatus.OK);
});

module.exports = {
  addActivity,
  getActivitiesForToken,
  getInvestments,
  claimInvestment
};
