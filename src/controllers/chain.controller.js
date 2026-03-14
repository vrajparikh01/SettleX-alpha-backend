const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { sendSuccessResponse } = require('../utils/ApiResponse');
const catchAsync = require('../utils/catchAsync');
const { chainService } = require('../services');



const addChain = catchAsync(async (req, res) => {

  const findChain = await chainService.getChainByChainId(req.body.chain_id);
  if (findChain) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Chain already exist');
  }

  const chain = await chainService.addChain(req.body);

  return sendSuccessResponse(res, 'chain created successfully', chain, httpStatus.CREATED);
});

module.exports = {
  addChain,
};
