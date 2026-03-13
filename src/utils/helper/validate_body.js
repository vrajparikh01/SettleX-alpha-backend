/**
Project: Airmeet-pagebuilder apis 
version : v0.1
author : @devanshu-pedalsupdesc : validate request body function
*/

/**
 * @param {Object} body //body of the request
 * @param {Array} Keys //query appended to the request
 */

exports.validateRequestBody = async (body, keys) => {
  try {
    var body_keys = Object.keys(body);

    var new_body = {};

    for (let i = 0; i < body_keys.length; i++) {
      if (keys.includes(body_keys[i])) {
        new_body[body_keys[i]] = body[body_keys[i]];
      }
    }

    if (Object.keys(new_body).length != keys.length) {
      return Promise.reject({ code: 400, httpErrorCode: 'HTTP_STATUS_BAD_REQUEST', message: 'invalid arguments' });
    }

    return Promise.resolve(new_body);
  } catch (error) {
    return Promise.reject({ code: 400, httpErrorCode: 'HTTP_STATUS_BAD_REQUEST', message: 'invalid arguments' });
  }
};
