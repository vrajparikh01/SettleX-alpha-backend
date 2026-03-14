const { Portfolio, CryptoToken } = require('../models');
const { Types } = require("mongoose");
const { ObjectId } = Types;

const findTokenInPortfolio = async (token_id, user_id) => {
  const portfolio = await Portfolio.findOne({token_id: token_id, user_id: user_id});
  return portfolio;
};

const addToPortfolio = async (data) => {
  return Portfolio.create(data);
};

const updatePortfolio = async (protfolio_id, data) => {
  return Portfolio.updateOne({ _id: protfolio_id }, data);
};

const getPortfolio = async (user_id) => {
  const portfolio = await Portfolio.aggregate([
    { $match: { user_id: new ObjectId(user_id) } },
    { 
      $lookup: { 
        from: CryptoToken.collection.name, 
        localField: 'token_id', 
        foreignField: '_id', 
        as: 'token' 
      } 
    },
    {
      $unwind: "$token"
    }
  ]);
  return portfolio;
};

module.exports = {
  findTokenInPortfolio,
  addToPortfolio,
  updatePortfolio,
  getPortfolio
};
