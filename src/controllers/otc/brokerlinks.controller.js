const httpStatus = require('http-status');
const ApiError = require('../../utils/ApiError');
const { sendSuccessResponse } = require('../../utils/ApiResponse');
const catchAsync = require('../../utils/catchAsync');
const { brokersLinkService, userService, cryptoTokenService } = require('../../services/index');
const { offerStatus, tradeType, OTCTokenType } = require('../../config/other.constant');

// TODO: when offer comes need to add listed_price and settled_price (find from offer model) 
const createLink = catchAsync(async (req, res) => {
  const getCurrentUser = await userService.getUserByWalletAddressAndChainId(req.body.broker_address, req.body.chain_id);
  if(!getCurrentUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  let offer_token = await cryptoTokenService.getTokenByAddressAndChainId(req.body.offer_token, req.body.chain_id);
  let accepted_token = await cryptoTokenService.getTokenByAddressAndChainId(req.body.receive_token, req.body.chain_id);

  if(!accepted_token || !offer_token) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Token not found');
  }

  req.body.offer_token = offer_token._id;
  req.body.receive_token = accepted_token._id;
  const link = await brokersLinkService.createLinks(req.body);

  return sendSuccessResponse(res, 'link created successfully', link, httpStatus.CREATED);
});

const findLinkById = catchAsync(async (req, res) => {
  const link = await brokersLinkService.findLinkById(req.params.link_id);
  if (!link) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Link not found');
  }


  if(link.offer_token.token_type == OTCTokenType.CMC){
    link.offer_token.price = await getPrice(link.offer_token.cmc_id);
  }

  if(link.receive_token.token_type == OTCTokenType.CMC){
    link.receive_token.price = await getPrice(link.receive_token.cmc_id);
  }
  
  return sendSuccessResponse(res, 'link retrived successfully', link, httpStatus.OK);
});

const getBrokersLinksForUser = catchAsync(async (req, res) => {
  const limit = 10;
  const page = req.query?.page || 1;
  const skip = (page - 1) * limit;

  const chain_id = req.query?.chain_id;
  const client_address = req.params.client_address;

  const activities = await brokersLinkService.getBrokersLinksForUser(client_address, chain_id, limit, skip);
  return sendSuccessResponse(res, 'links list retrived successfully', activities, httpStatus.OK);
});

const getBrokersLinksForBroker = catchAsync(async (req, res) => {
  const limit = 10;
  const page = req.query?.page || 1;
  const skip = (page - 1) * limit;

  const chain_id = req.query?.chain_id;
  const broker_address = req.params.broker_address;

  const activities = await brokersLinkService.getBrokersLinksForBroker(broker_address, chain_id, limit, skip);
  return sendSuccessResponse(res, 'links list retrived successfully', activities, httpStatus.OK);
});


module.exports = {
  createLink,
  findLinkById,
  getBrokersLinksForUser,
  getBrokersLinksForBroker,
};
