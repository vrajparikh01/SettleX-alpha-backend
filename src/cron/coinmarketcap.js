var cron = require('node-cron');
const axios = require('axios');
const config = require('../config/config')
const {CryptoToken} = require('../models/index');
const { OTCTokenType } = require('../config/other.constant');

const chain_list = ['polygon', 'bnb', 'ethereum']
const chain_id_list = [137, 56, 1]
const chain_list_defilama = [ "polygon", 'bsc', 'ethereum']

const getTokens = async () => {
  try {

      console.log("Started CoinMarketCap")

      let reqConfig = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/map',
        headers: { 
          'X-CMC_PRO_API_KEY': config.COINMARKET_CAP_API_KEY 
        }
      };
  
      const getAlloken = await axios(reqConfig)

      let tokenList = getAlloken.data.data
      tokenList = tokenList.filter((token) => token.platform != null);

      for (let i = 0; i < chain_list.length; i++) {
        const chain = chain_list[i];
        const ethTokenList = tokenList.filter((token) => token.platform.slug == chain);
 
        for (let j = 0; j < ethTokenList.length; j++) {
          const token = ethTokenList[j];
          const item ={
            symbol: token.symbol,
            chain_id: chain_id_list[i],
            number_of_decimals: 18,
            cmc_id: token.id,
            slug: token.slug,
            name: token.name,
            token_image: `https://s2.coinmarketcap.com/static/img/coins/64x64/${token.id}.png`,
            token_address: token.platform.token_address,
            is_deleted: false,
            price: 0,
            token_type: OTCTokenType.CMC
          }
  
          const findToken = await CryptoToken.findOne({ token_address: item.token_address, chain_id: item.chain_id });
          if(!findToken) {
            try {
              const difillamaData = await axios.get(`https://coins.llama.fi/prices/current/${chain_list_defilama[i]}:${item.token_address}`)
         
              if(difillamaData.data.coins && difillamaData.data.coins[`${chain_list_defilama[i]}:${item.token_address}`]) {
                item.number_of_decimals = difillamaData.data.coins[`${chain_list_defilama[i]}:${item.token_address}`].decimals
              }
  
              await CryptoToken.updateOne(
                { token_address: item.token_address, chain_id: item.chain_id },
                { $setOnInsert: item },
                { upsert: true }
              )
            } catch (error) {
              console.log(error)
            }

          }
  
        }
      }



    } catch (error) {
      console.log(error);
    }
}

module.exports = getTokens