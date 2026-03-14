const httpStatus = require('http-status');
const { sendSuccessResponse } = require('../utils/ApiResponse');
const catchAsync = require('../utils/catchAsync');
const { portfolioService } = require('../services');

const getPortfolio = catchAsync(async (req, res) => {
  const portfolio = await portfolioService.getPortfolio(req.user._id);
  return sendSuccessResponse(res, 'portfolio retrived successfully', portfolio, httpStatus.CREATED);
});


module.exports = {
  getPortfolio,
};
