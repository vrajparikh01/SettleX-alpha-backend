const httpStatus = require('http-status');
const pick = require('../../utils/pick');
const ApiError = require('../../utils/ApiError');
const { sendSuccessResponse } = require('../../utils/ApiResponse');
const catchAsync = require('../../utils/catchAsync');
const { preMarketTokenService } = require('../../services');

const getTokens = catchAsync(async (req, res) => {
  const limit = 10;
  const page = req.query?.page || 1;
  const skip = (page - 1) * limit;
  let data = await preMarketTokenService.queryTokens(skip, limit, req.query.chain_id);
  return sendSuccessResponse(res, 'token list retrived successfully', data, httpStatus.OK);
});

const getCollateralTokens = catchAsync(async (req, res) => {
  const limit = 10;
  const page = req.query?.page || 1;
  const skip = (page - 1) * limit;
  let data = await preMarketTokenService.queryCollateralTokens(skip, limit, req.query.chain_id);
  return sendSuccessResponse(res, 'Collateral token list retrived successfully', data, httpStatus.OK);
});

const createToken = catchAsync(async (req, res) => {
  const findTokenByAddress = await preMarketTokenService.getTokenByAddressAndChainId(req.body.token_address, req.body.chain_id);
  if (findTokenByAddress) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Token already exists');
  }
  const token = await preMarketTokenService.createToken(req.body);
  return sendSuccessResponse(res, 'token created successfully', token, httpStatus.CREATED);
});

const getTokenById = catchAsync(async (req, res) => {
  const token = await preMarketTokenService.getTokenById(req.params.token_id);
  if (!token) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Token not found');
  }
  return sendSuccessResponse(res, 'token retrived successfully', token, httpStatus.OK);
});

const updateToken = catchAsync(async (req, res) => {
  const findTokenById = await preMarketTokenService.getTokenById(req.params.token_id);
  if (!findTokenById) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Token not found');
  }
  const token = await preMarketTokenService.updateToken(req.params.token_id, req.body);
  return sendSuccessResponse(res, 'token updated successfully', token, httpStatus.OK);
});


const getTokenByAddress = catchAsync(async (req, res) => {
  const token = await preMarketTokenService.getTokenByAddress(req.params.token_address);
  if (!token) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Token not found');
  }
  return sendSuccessResponse(res, 'token retrived successfully', token, httpStatus.OK);
});


module.exports = {
  getTokens,
  createToken,
  getTokenById,
  updateToken,
  getTokenByAddress,
  getCollateralTokens
};
