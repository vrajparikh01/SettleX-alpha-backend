/**
Project: Yield-Yeti apis 
version : v0.1
author : @devanshu-pedalsup 
desc : Util For Encryption decryption.
*/

// This is global encrypting decryption this is used to encrypt and decrypt all data that is sensitive and cannot be send to user in plain format

// requiring modules
const CryptoJS = require('crypto-js');

// requiring .env
const path = require('path');
require('dotenv').config({ path: path.resolve(`${__dirname}./../.env`) });

/**
 * @param {string} token // token to encrypt
 */

// encrypting tokens
exports.encryptToken = (token) => {
  const x = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(token), process.env.KEY_ENCRYPT_DECRYPT).toString();
  return Buffer.from(x, 'utf8').toString('base64');
};

/**
 * @param {string} token // encrypted token to decrypt
 */

// decrypting tokens
exports.decryptToken = (token) => {
  const utf8encoded = Buffer.from(token, 'base64').toString('utf8');
  const bytes = CryptoJS.AES.decrypt(utf8encoded, process.env.KEY_ENCRYPT_DECRYPT);
  return bytes.toString(CryptoJS.enc.Utf8);
};
