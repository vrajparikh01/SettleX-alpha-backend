const httpStatus = require('http-status');
const ApiError = require('../../utils/ApiError');
const { sendSuccessResponse } = require('../../utils/ApiResponse');
const catchAsync = require('../../utils/catchAsync');
const { tradesService, portfolioService, cryptoTokenService, userService, activityService, brokersLinkService } = require('../../services');
const { tradeType } = require('../../config/other.constant');
const { isValidObjectId } = require('mongoose');

const createTrade = catchAsync(async (req, res) => {
  let findTokenByAddress = await cryptoTokenService.getTokenByAddressAndChainId(req.body.offer_token, req.body.chain_id);
  let accepted_token = await cryptoTokenService.getTokenByAddressAndChainId(req.body.receive_token, req.body.chain_id);

  if(!accepted_token) {
    accepted_token = await cryptoTokenService.createToken({
      token_address: req.body.receive_token,
      chain_id: req.body.chain_id,
      symbol: req.body.receive_token_symbol,
      name: req.body.receive_token_name,
      token_image: req.body.receive_token_image,
      number_of_decimals: req.body.receive_token_decimals
    })
  }

  if(!findTokenByAddress) {
    findTokenByAddress = await cryptoTokenService.createToken({
      token_address: req.body.offer_token,
      chain_id: req.body.chain_id,
      symbol: req.body.offer_token_symbol,
      name: req.body.offer_token_name,
      token_image: req.body.offer_token_image,
      number_of_decimals: req.body.offer_token_decimals
    })
  }

  /* if(req.body.trade_type == tradeType.SELL) {
    const findTokenInPortfolio = await portfolioService.findTokenInPortfolio(findTokenByAddress._id, req.user._id);
    if(!findTokenInPortfolio) {
      const obj = {
        user_id: req.user._id,
        token_id: findTokenByAddress._id,
        token_amount: req.body.total_token,
        invested_amount: req.body.price_per_token * req.body.total_token
      }
      await portfolioService.addToPortfolio(obj);
    } else {
      const obj = {
        user_id: req.user._id,
        token_id: findTokenByAddress._id,
        token_amount: findTokenInPortfolio.token_amount + req.body.total_token,
        invested_amount: findTokenInPortfolio.invested_amount + (req.body.price_per_token * req.body.total_token)
      }
      await portfolioService.updatePortfolio(findTokenInPortfolio._id, obj);
    }
  } */

  const userInfo = await userService.getUserByWalletAddressAndChainId(req.body.trader_wallet_address, req.body.chain_id);

  req.body.is_settled = false;
  req.body.user_id = userInfo._id;
  req.body.offer_token = findTokenByAddress._id;
  req.body.available_token = req.body.total_token;
  req.body.receive_token = accepted_token._id;
  const token = await tradesService.createTrade(req.body);

  if(isValidObjectId(req.body.broker_link_id)) {
    const link = await brokersLinkService.findLinkById(req.body.broker_link_id);
    if(link) {
      await brokersLinkService.updateLinks(link._id, { is_deal_created: true });
    }
  }

  return sendSuccessResponse(res, 'trade created successfully', token, httpStatus.CREATED);
});


const getTrade = catchAsync(async (req, res) => {
  if(!isValidObjectId(req.params.trade_id)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid trade');
  }
  const findTradeById = await tradesService.getTradeById(req.params.trade_id);
  if (!findTradeById) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Trade not found');
  }
  return sendSuccessResponse(res, 'trade list retrived successfully', findTradeById, httpStatus.OK);
});


const getTrades = catchAsync(async (req, res) => {
  const limit = 10;
  const page = req.query?.page || 1;
  const skip = (page - 1) * limit;

  const type = req.query?.type || 'all';
  const name = req.query?.name;
  const chain_id = req.query?.chain_id;

  const search_with_amount = {}

  if(req.query.offer_token && req.query.offer_token_amount) {
    Object.assign(search_with_amount, {
      offer_token: req.query.offer_token,
      // offer_token_amount: req.query.offer_token_amount
    })
  }

  if(req.query.receive_token && req.query.receive_token_amount) {
    Object.assign(search_with_amount, {
      receive_token: req.query.receive_token,
      // receive_token_amount: req.query.receive_token_amount
    })
  }

  const {trades, totalTrades} = await tradesService.getTrades(skip, limit, type, name, chain_id, search_with_amount);
  trades.forEach((trade) => {
    if(trade.trade_type == tradeType.BUY) {
      const orignalPrice = (trade.total_token * trade.price_per_token)
      trade.number_of_token_require = (orignalPrice / trade.receive_token.price)
      const diff = trade.total_price - orignalPrice;
      trade.price_in_x = Number((diff/orignalPrice).toFixed(2)) || 0
    }

    if(trade.trade_type == tradeType.SELL) {
      const orignalPrice = (trade.total_token * trade.price_per_token)
      trade.number_of_token_require = (orignalPrice / trade.offer_token.price)
      const diff = trade.total_price - orignalPrice;
      trade.price_in_x = Number((diff/orignalPrice).toFixed(2)) || 0

      const temp = trade.offer_token;
      trade.offer_token = trade.receive_token;
      trade.receive_token = temp;
    }

    return trade
  })

  return sendSuccessResponse(res, 'trade list retrived successfully', {trades, totalTrades}, httpStatus.OK);
});

const cancelTrade = catchAsync(async (req, res) => {
  if(!isValidObjectId(req.params.trade_id)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid trade');
  }

  const findTradeById = await tradesService.getTradeById(req.params.trade_id);
  if (!findTradeById) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Trade not found');
  }
  const trade = await tradesService.cancelTrade(req.params.trade_id);

  await activityService.addActivity({
    token_id: findTradeById.offer_token,
    user_id: trade.user_id,
    activity_type: tradeType.CANCEL,
    trade_id: req.params.trade_id,
    total_token: findTradeById.total_token,
    price_per_token: findTradeById.price_per_token,
    listed_price: findTradeById.price_per_token,
    settled_price: findTradeById.price_per_token,
    transaction_hash: "",
    from_address: findTradeById.receiver_wallet_address,
    to_address: ""
  });

  return sendSuccessResponse(res, 'trade canceled successfully', trade, httpStatus.OK);
});

const getTokensTrades = catchAsync(async (req, res) => {

  const limit = 10;
  const page = req.query?.page || 1;
  const skip = (page - 1) * limit;

  const type = req.query?.type || 'all';

  const {trades, totalTrades} = await tradesService.getTokensTrades(req.params.token_id, skip, limit, type);
  trades.forEach((trade) => {
    if(trade.trade_type == tradeType.BUY) {
      const orignalPrice = (trade.total_token * trade.price_per_token)
      trade.number_of_token_require = (orignalPrice / trade.receive_token.price)
      const diff = trade.total_price - orignalPrice;
      trade.price_in_x = Number((diff/orignalPrice).toFixed(2)) || 0
    }

    if(trade.trade_type == tradeType.SELL) {
      const orignalPrice = (trade.total_token * trade.price_per_token)
      trade.number_of_token_require = (orignalPrice / trade.offer_token.price)
      const diff = trade.total_price - orignalPrice;
      trade.price_in_x = Number((diff/orignalPrice).toFixed(2)) || 0

      const temp = trade.offer_token;
      trade.offer_token = trade.receive_token;
      trade.receive_token = temp;
    }
    return trade
  })
  
  return sendSuccessResponse(res, 'trade list retrived successfully', {trades, totalTrades}, httpStatus.OK);
});

const increaseViewCount = catchAsync(async (req, res) => {
  if(!isValidObjectId(req.params.trade_id)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid trade');
  }
  const findTradeById = await tradesService.getTradeById(req.params.trade_id);
  if (!findTradeById) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Trade not found');
  }
  await tradesService.increaseViewCount(req.params.trade_id);

  return sendSuccessResponse(res, 'view count increased successfully', {}, httpStatus.OK);
})


const getBrokersTrades = catchAsync(async (req, res) => {
  const limit = 10;
  const page = req.query?.page || 1;
  const skip = (page - 1) * limit;

  const type = req.query?.type || 'all';
  const name = req.query?.name;
  const chain_id = req.query?.chain_id;

  const {trades, totalTrades} = await tradesService.getBrokersTrades(skip, limit, type, name, chain_id);
  trades.forEach((trade) => {
    if(trade.trade_type == tradeType.BUY) {
      const orignalPrice = (trade.total_token * trade.price_per_token)
      trade.number_of_token_require = (orignalPrice / trade.receive_token.price)
      const diff = trade.total_price - orignalPrice;
      trade.price_in_x = Number((diff/orignalPrice).toFixed(2)) || 0
    }

    if(trade.trade_type == tradeType.SELL) {
      const orignalPrice = (trade.total_token * trade.price_per_token)
      trade.number_of_token_require = (orignalPrice / trade.offer_token.price)
      const diff = trade.total_price - orignalPrice;
      trade.price_in_x = Number((diff/orignalPrice).toFixed(2)) || 0

      const temp = trade.offer_token;
      trade.offer_token = trade.receive_token;
      trade.receive_token = temp;
    }
    return trade
  })

  return sendSuccessResponse(res, 'trade list retrived successfully', {trades, totalTrades}, httpStatus.OK);
});


const getUserSpecificTrades = catchAsync(async (req, res) => {
  const findUser = await userService.getUserByWalletAddressAndChainId(req.params.wallet_address, req.query.chain_id);
  if (!findUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const limit = 10;
  const page = req.query?.page || 1;
  const skip = (page - 1) * limit;

  const type = req.query?.type || 'all';
  const chain_id = req.query?.chain_id;

  const { trades, totalTrades } = await tradesService.getUserSpecificTrades(findUser._id, skip, limit, type, chain_id);

  trades.forEach((trade) => {
    if(trade.trade_type == tradeType.BUY) {
      const orignalPrice = (trade.total_token * trade.price_per_token)
      trade.number_of_token_require = (orignalPrice / trade.receive_token.price)
      const diff = trade.total_price - orignalPrice;
      trade.price_in_x = Number((diff/orignalPrice).toFixed(2)) || 0
    }

    if(trade.trade_type == tradeType.SELL) {
      const orignalPrice = (trade.total_token * trade.price_per_token)
      trade.number_of_token_require = (orignalPrice / trade.offer_token.price)
      const diff = trade.total_price - orignalPrice;
      trade.price_in_x = Number((diff/orignalPrice).toFixed(2)) || 0

      const temp = trade.offer_token;
      trade.offer_token = trade.receive_token;
      trade.receive_token = temp;
    }
    return trade
  })

  return sendSuccessResponse(res, 'trade list retrived successfully', {trades, totalTrades}, httpStatus.OK);
});


const getActiveSellingTrendingTrades = catchAsync(async (req, res) => {

  const chain_id = req.query?.chain_id;
  const mostActive = await tradesService.getMostActiveTrades(chain_id);
  const hotSelling = await tradesService.getMostHotSellingTrades(chain_id);
  const topTrending = await tradesService.getTopTredingTrades(chain_id);

  return sendSuccessResponse(res, 'top trades retrived successfully', {mostActive, hotSelling, topTrending}, httpStatus.OK);
})


module.exports = {
  createTrade,
  getTrade,
  getTrades,
  getTokensTrades,
  cancelTrade,
  increaseViewCount,
  getBrokersTrades,
  getUserSpecificTrades,
  getActiveSellingTrendingTrades
};
