class ApiResponse {
  constructor(statusCode, message, data = null) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}

const sendSuccessResponse = (res, message, data = null, statusCode = 200) => {
  const response = new ApiResponse(statusCode, message, data);
  return res.status(statusCode).json(response);
};

module.exports = {
  sendSuccessResponse,
  ApiResponse,
};