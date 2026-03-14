const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const cryptoTokenRoute = require('./otc/cryptotoken.route');
const tradeRoute = require('./otc/trade.route');
const offerRoute = require('./offer.route');
const activityRoute = require('./otc/activity.route');
const portfolioRoute = require('./portfolio.route');
const chainRoute = require('./chain.route');
const brokerLinksRoute = require('./otc/brokerlink.route');
const preMarketTradeRoute = require('./premarket/premarket_trade.route');
const preMarketActivityRoute = require('./premarket/premarket_activity.route');
const preMarketTokensRoute = require('./premarket/premarkettoken.route');
const commanRoute = require('./comman.route');
const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/tokens',
    route: cryptoTokenRoute,
  },
  {
    path: '/trade',
    route: tradeRoute,
  },
  {
    path: '/offers',
    route: offerRoute,
  },
  {
    path: '/activity',
    route: activityRoute,
  },
  {
    path: '/portfolio',
    route: portfolioRoute,
  },
  {
    path: '/premarket/trade',
    route: preMarketTradeRoute,
  },
  {
    path: '/premarket/activity',
    route: preMarketActivityRoute,
  },
  {
    path: '/premarket/tokens',
    route: preMarketTokensRoute,
  },
  {
    path: '/chain',
    route: chainRoute,
  },
  {
    path: '/brokerlinks',
    route: brokerLinksRoute,
  },
  {
    path: '/common',
    route: commanRoute,
  },
];


defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
