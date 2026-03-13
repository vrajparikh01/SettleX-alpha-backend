/**
Project: Airmeet-content-hub apis 
version : v0.1
author : @devanshu-pedalsup 
desc : Logger Index file.
*/

const { developLogger } = require('./development_logger');
const { productionLogger } = require('./production_logger');

var logger;

//create logger for development
if (process.env.NODE_ENV == 'development') {
  logger = developLogger();
}

//create logger for production
else if (process.env.NODE_ENV == 'production') {
  logger = productionLogger();
}

//if environment variable is missing create logger for development
else {
  logger = developLogger();
}

module.exports = { logger };
