/**
Project: pedalsup studio apis 
version : v0.1
author : @devanshu-pedalsup 
desc : Logger file for development stage.
*/

//libraries
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

//development logger
exports.developLogger = () => {
  const myFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp}--:--${level}--:--${message}`;
  });

  return createLogger({
    level: 'debug',
    format: combine(timestamp({ format: 'HH:mm:ss' }), myFormat),

    transports: [
      new transports.Console(),
      new transports.File({ filename: './logs/develop_logs/error.log', level: 'error' }),
      new transports.File({ filename: './logs/develop_logs/info.log', level: 'info' }),
    ],
  });
};
