/**
Project: pedalsup_buddy apis 
version : v0.1
author : @devanshu-pedalsupdesc : Controllers
*/

const messages = require('../../constants/response');

const { logger_methods } = require('../logger/logger_methods');

/**
 * @param {requestObject} req //Request object
 * @param {responseObject} res //response object
 * @param {Number} code //http status code
 * @param {dataObject} data //data to be send to frontEnd
 */

exports.response = async (req, res, code, data) => {
  logger_methods[messages[code]['httpCode']](
    messages[code]['message'],
    messages[code]['httpCode'],
    req.userId,
    req.originalUrl,
    req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.connection.remoteAddress || null
  );

  res.status(messages[code]['httpCode']).json({
    code: messages[code]['httpCode'],
    message: messages[code]['message'],
    data: data || {},
  });
};
