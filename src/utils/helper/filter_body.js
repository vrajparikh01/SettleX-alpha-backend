/**
Project: Airmeet-pagebuilder apis 
version : v0.1
author : @devanshu-pedalsupdesc : Controllers
*/

/**
 * @param {Object} body //Request body
 */
exports.filterBody = async (body) => {
  try {
    // eslint-disable-next-line camelcase
    const body_keys = Object.keys(body);
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < body_keys.length; i++) {
      // eslint-disable-next-line eqeqeq
      if (body[body_keys[i]] == '') {
        // eslint-disable-next-line no-param-reassign
        delete body[body_keys[i]];
      }
    }

    return Promise.resolve(body);
  } catch (error) {
    return Promise.resolve({ code: 500, message: 'internal_server_error' });
  }
};
