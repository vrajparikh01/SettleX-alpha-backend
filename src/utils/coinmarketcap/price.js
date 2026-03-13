const axios = require("axios");
const config = require("../../config/config");

const getPrice = async (ids) => {
  try {
    let reqConfig = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?id=${ids}`,
      headers: {
        "X-CMC_PRO_API_KEY": config.COINMARKET_CAP_API_KEY,
      },
    };

    const { data } = await axios.request(reqConfig);
    const price = data.data[ids].quote.USD.price;
    return price
  } catch (error) {
    return 0;
  }
};


module.exports = {
  getPrice
}