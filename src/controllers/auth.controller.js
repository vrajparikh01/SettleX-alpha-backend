const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, tokenService } = require('../services');

const login = catchAsync(async (req, res) => {
  const { wallet_address, chainId } = req.body;
  const user = await authService.loginWithWallet(wallet_address, Number(chainId));
  // const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user });
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

module.exports = {
  login,
  logout,
  refreshTokens,
};
