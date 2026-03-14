const {getUserByWalletAddressAndChainId} =require('../services/user.service');

const onlyadmin = async (req, res, next) => {
  const userInfo = await getUserByWalletAddressAndChainId(req.body.wallet_address, req.body.chain_id);
  if (!userInfo || userInfo?.role !== 'admin') {
    return res.status(401).json({
      status: 'fail',
      message: 'Unauthorized',
    });
  }
  next();
};

const onlyPremarketAndAdmin = async (req, res, next) => {
  const userInfo = await getUserByWalletAddressAndChainId(req.body.wallet_address, req.body.chain_id);
  if (!userInfo || (userInfo.role !== 'admin' && userInfo.role !== 'premarket')) {
    return res.status(401).json({
      status: 'fail',
      message: 'Unauthorized',
    });
  }
  next();
};

module.exports = {onlyadmin, onlyPremarketAndAdmin}