const httpStatus = require('http-status');
const pick = require('../../utils/pick');
const ApiError = require('../../utils/ApiError');
const { sendSuccessResponse } = require('../../utils/ApiResponse');
const catchAsync = require('../../utils/catchAsync');
const { cryptoTokenService } = require('../../services');
const config = require("../../config/config");
const axios = require('axios');
const { getPrice } = require('../../utils/coinmarketcap/price');
const { OTCTokenType } = require('../../config/other.constant');

const getTokens = catchAsync(async (req, res) => {
  // const limit = 10;
  // const page = req.query?.page || 1;
  // const skip = (page - 1) * limit;
  let data = await cryptoTokenService.queryTokens(req.params.chain_id);
  return sendSuccessResponse(res, 'token list retrived successfully', data, httpStatus.OK);
});

const createToken = catchAsync(async (req, res) => {
  const findTokenByAddress = await cryptoTokenService.getTokenByAddressAndChainId(req.body.token_address, req.body.chain_id);
  if (findTokenByAddress) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Token already exists');
  }
  const token = await cryptoTokenService.createToken(req.body);
  return sendSuccessResponse(res, 'token created successfully', token, httpStatus.CREATED);
});

const getTokenById = catchAsync(async (req, res) => {
  let token = await cryptoTokenService.getTokenById(req.params.token_id);
  if (!token) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Token not found');
  }

  let coinPrice = token?.price || 0
  if(token.token_type == OTCTokenType.CMC){
    coinPrice = await getPrice(token.cmc_id);
  }
  const lastTraded = await cryptoTokenService.getLastTradedPrice(req.params.token_id);
  const lastTradedPrice = lastTraded.length > 0 ? lastTraded[0].price_per_token : 0
  token = {...token, last_traded_price: lastTradedPrice}
  Object.assign(token, {price: coinPrice})
  return sendSuccessResponse(res, 'token retrived successfully', token, httpStatus.OK);
});

const updateToken = catchAsync(async (req, res) => {
  const findTokenById = await cryptoTokenService.getTokenById(req.params.token_id);
  if (!findTokenById) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Token not found');
  }
  const token = await cryptoTokenService.updateToken(req.params.token_id, req.body);
  return sendSuccessResponse(res, 'token updated successfully', token, httpStatus.OK);
});

const deleteToken = catchAsync(async (req, res) => {
  const findTokenById = await cryptoTokenService.getTokenById(req.params.token_id);
  if (!findTokenById) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Token not found');
  }
  const token = await cryptoTokenService.deleteToken(req.params.token_id);
  return sendSuccessResponse(res, 'token deleted successfully', token, httpStatus.OK);
});

const getTokenByAddress = catchAsync(async (req, res) => {
  const token = await cryptoTokenService.getTokenByAddress(req.params.token_address);
  if (!token) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Token not found');
  }
  return sendSuccessResponse(res, 'token retrived successfully', token, httpStatus.OK);
});

const getCustomTokenAddedbyAdmin = catchAsync(async (req, res) => {
  const limit = 10;
  const page = req.query?.page || 1;
  const skip = (page - 1) * limit;

  const searchByName = req.query?.name || '';
  const chain_id = req.query?.chain_id || '';

  let data = await cryptoTokenService.getCustomTokenAddedbyAdmin(skip, limit, chain_id, searchByName);
  
  return sendSuccessResponse(res, 'token added by admin are retrived successfully', data, httpStatus.OK);
});

module.exports = {
  getTokens,
  createToken,
  getTokenById,
  updateToken,
  deleteToken,
  getTokenByAddress,
  getCustomTokenAddedbyAdmin,
};
