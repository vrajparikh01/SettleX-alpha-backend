const httpStatus = require('http-status');
const ApiError = require('../../utils/ApiError');
const { sendSuccessResponse } = require('../../utils/ApiResponse');
const catchAsync = require('../../utils/catchAsync');
const { preMarketTradeService, preMarketTokenService, userService, activityService } = require('../../services');
const { tradeType } = require('../../config/other.constant');
const { isValidObjectId } = require('mongoose');

const createTrade = catchAsync(async (req, res) => {

  let offerToken = await preMarketTokenService.getTokenByAddressAndChainId(req.body.offer_token, req.body.chain_id);
  let receiveToken = await preMarketTokenService.getTokenByAddressAndChainId(req.body.receive_token, req.body.chain_id);

  if(!offerToken || !receiveToken) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Token');
  }

  const userInfo = await userService.getUserByWalletAddressAndChainId(req.body.wallet_address, req.body.chain_id);

  req.body.is_settled = false;
  req.body.user_id = userInfo._id;
  req.body.offer_token = offerToken._id;
  req.body.receive_token = receiveToken._id;
  req.body.available_token = req.body.total_token;
  const token = await preMarketTradeService.createTrade(req.body);

  return sendSuccessResponse(res, 'trade created successfully', token, httpStatus.CREATED);
});

const updateTrade = catchAsync(async (req, res) => {
  const {is_distributed, wallet_address, chain_id, is_claimed} = req.body
  const findTrade = await preMarketTradeService.getTradeById(req.params.trade_id);
  if (!findTrade) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Trade not found');
  }
  
  const data = {
    is_distributed: is_distributed,
    is_claimed: is_claimed,
  }

  if(req.body?.is_untraded_claimed) {
    Object.assign(data, {
      is_untraded_claimed: req.body.is_untraded_claimed
    })
  }
  
  const trade = await preMarketTradeService.updateTrade(req.params.trade_id, data);
  return sendSuccessResponse(res, 'trade updated successfully', trade, httpStatus.OK);
});

const getTrades = catchAsync(async (req, res) => {
  const limit = 10;
  const page = req.query?.page || 1;
  const skip = (page - 1) * limit;

  const name = req.query?.name;
  const type = req.query?.type || 'all';
  const chain_id = req.query?.chain_id;
  const currentTime = Math.floor(Date.now()/1000);

  const {trades, totalTrades} = await preMarketTradeService.getTrades(skip, limit, name, chain_id, type);
  trades.forEach((trade) => {

      // const orignalPrice = (trade.total_token * trade.price_per_token)
      // trade.number_of_token_require = (orignalPrice / trade.receive_token.price)
      trade.number_of_token_require = trade.collateral_token_amount

      trade.is_tge_start = trade.offer_token.tge < currentTime;
      trade.is_investment_start = trade.offer_token.start_date < currentTime;
      trade.is_investment_end = trade.offer_token.end_date < currentTime;

    
    return trade
  })

  return sendSuccessResponse(res, 'trade list retrived successfully', {trades, totalTrades}, httpStatus.OK);
});

const getUserTrades = catchAsync(async (req, res) => {
  const limit = 10;
  const page = req.query?.page || 1;
  const skip = (page - 1) * limit;

  const name = req.query?.name;
  const chain_id = req.query?.chain_id;
  const currentTime = Math.floor(Date.now()/1000);

  const userInfo = await userService.getUserByWalletAddressAndChainId(req.params.wallet_address, chain_id);
  if(!userInfo) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const {trades, totalTrades} = await preMarketTradeService.getUsersTrades(skip, limit, name, userInfo._id, chain_id);
  trades.forEach((trade) => {

      // const orignalPrice = (trade.total_token * trade.price_per_token)
      // trade.number_of_token_require = (orignalPrice / trade.receive_token.price)
      trade.number_of_token_require = trade.collateral_token_amount

      trade.is_tge_start = trade.offer_token.tge < currentTime;
      trade.is_investment_start = trade.offer_token.start_date < currentTime;
      trade.is_investment_end = trade.offer_token.end_date < currentTime;

    
    return trade
  })

  return sendSuccessResponse(res, 'trade list retrived successfully', {trades, totalTrades}, httpStatus.OK);
});


const increaseViewCount = catchAsync(async (req, res) => {
  if(!isValidObjectId(req.params.trade_id)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid trade');
  }
  const findTradeById = await preMarketTradeService.getTradeById(req.params.trade_id);
  if (!findTradeById) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Trade not found');
  }
  await preMarketTradeService.increaseViewCount(req.params.trade_id);

  return sendSuccessResponse(res, 'view count increased successfully', {}, httpStatus.OK);
})


const getTrade = catchAsync(async (req, res) => {
  if(!isValidObjectId(req.params.trade_id)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid trade');
  }
  const findTradeById = await preMarketTradeService.getTradeById(req.params.trade_id);
  if (!findTradeById) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Trade not found');
  }
  return sendSuccessResponse(res, 'trade list retrived successfully', findTradeById, httpStatus.OK);
});

const cancelTrade = catchAsync(async (req, res) => {
  if(!isValidObjectId(req.params.trade_id)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid trade');
  }
  const findTradeById = await preMarketTradeService.getTradeById(req.params.trade_id);
  if (!findTradeById) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Trade not found');
  }

  if(findTradeById.completion_percentage != 0 ){
    return sendSuccessResponse(res, 'trade can not be cancelled', {}, httpStatus.OK);
  }
  
  const trade = await preMarketTradeService.cancelTrade(req.params.trade_id);
  return sendSuccessResponse(res, 'trade cancelled successfully', trade, httpStatus.OK);
});


module.exports = {
  createTrade,
  updateTrade,
  getTrades,
  getUserTrades,
  increaseViewCount,
  getTrade,
  cancelTrade
};
