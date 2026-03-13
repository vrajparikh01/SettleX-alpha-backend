const jwt = require('jsonwebtoken');
const { decryptToken } = require('./encrypt_decrypt');

exports.validate_token = async (token, secret) => {
  try {
    // taking token from header
    const jwtToken = token;
    const tokenArray = jwtToken.split(' ');

    // decrypting token
    const decrypt = decryptToken(tokenArray[1]);

    // verifying it
    const data = jwt.verify(decrypt, secret);

    return Promise.resolve({
      email: data.email,
      userId: data.userId,
    });
  } catch (error) {
    return Promise.reject(error);
  }
};
