const { ChainList } = require("../models");

const addChain = async (data) => {
  const offer = await ChainList.create(data);
  return offer;
};

const getChains = async () => {
  const chain = await ChainList.find();
  return chain;
};

const getChainByChainId = async (chain_id) => {
  const chain = await ChainList.findOne({chain_id});
  return chain;
};


module.exports = {
  addChain,
  getChains,
  getChainByChainId
};
