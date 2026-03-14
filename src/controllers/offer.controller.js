const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const { sendSuccessResponse } = require('../utils/ApiResponse');
const catchAsync = require('../utils/catchAsync');
const { offerService, tradesService } = require('../services');
const { offerStatus } = require('../config/other.constant');


const createOffer = catchAsync(async (req, res) => {

  const findTradeById = await tradesService.getTradeById(req.body.trade_id);
  if (!findTradeById) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Trade not found');
  }
  
  req.body.user_id = req.user._id;
  req.body.is_accepted = offerStatus.PENDING;
  req.body.trade_owner_id = findTradeById.user_id;

  const offer = await offerService.createOffer(req.body);

  return sendSuccessResponse(res, 'offer created successfully', offer, httpStatus.CREATED);
});

const updateOffer = catchAsync(async (req, res) => {
  const findOfferById = await offerService.getOfferById(req.params.offer_id, req.user._id);
  if (findOfferById.length == 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Offer not found');
  }
  const offer = await offerService.updateOffer(req.params.offer_id, req.body);
  return sendSuccessResponse(res, 'offer updated successfully', offer, httpStatus.OK);
});

const getOffer = catchAsync(async (req, res) => {
  const findOfferById = await offerService.getOfferById(req.params.offer_id, req.user._id);
  if (findOfferById.length == 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Offer not found');
  }
  return sendSuccessResponse(res, 'offer retrived successfully', findOfferById, httpStatus.OK);
});

const removeOffer = catchAsync(async (req, res) => {
  const findOfferById = await offerService.getOfferById(req.params.offer_id, req.user._id);
  if (findOfferById.length == 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Offer not found');
  }
  const offer = await offerService.removeOffer(req.params.offer_id);
  return sendSuccessResponse(res, 'offer deleted successfully', offer, httpStatus.OK);
});

const getOffers = catchAsync(async (req, res) => {
  const offers = await offerService.getOffers(req.user._id);
  return sendSuccessResponse(res, 'offer list retrived successfully', offers, httpStatus.OK);
});

const acceptOffer = catchAsync(async (req, res) => {
  const findOfferById = await offerService.getOfferById(req.params.offer_id);
  if (findOfferById.length == 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Offer not found');
  }
  const offer = await offerService.acceptOffer(req.params.offer_id);
  return sendSuccessResponse(res, 'offer accepted successfully', offer, httpStatus.OK);
});

const rejectOffer = catchAsync(async (req, res) => {
  const findOfferById = await offerService.getOfferById(req.params.offer_id);
  if (findOfferById.length == 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Offer not found');
  }
  const offer = await offerService.rejectOffer(req.params.offer_id);
  return sendSuccessResponse(res, 'offer rejected successfully', offer, httpStatus.OK);
});

const countOffers = catchAsync(async (req, res) => {
  const count = await offerService.countOffers(req.user._id);
  return sendSuccessResponse(res, 'offer count retrived successfully', count, httpStatus.OK);
});

const getMyProposedOffers = catchAsync(async (req, res) => {
  const offers = await offerService.getMyProposedOffers(req.user._id);
  return sendSuccessResponse(res, 'offer list retrived successfully', offers, httpStatus.OK);
});

module.exports = {
  createOffer,
  updateOffer,
  getOffer,
  removeOffer,
  getOffers,
  acceptOffer,
  rejectOffer,
  countOffers,
  getMyProposedOffers
};
