const { apiBadRequestResponse, apiResponse } = require("./response");
const { StatusCodes } = require("http-status-codes");

function bodyParserHandler(err, req, res, next) {
  if (err instanceof SyntaxError || err instanceof TypeError) {
    // console.error(error);
    return res.status(StatusCodes.BAD_REQUEST).json(apiBadRequestResponse("Malformed JSON"))
  }
}

function fourOhFourHandler(req, res, next) {
  return res
          .status(StatusCodes.NOT_FOUND)
          .json(apiBadRequestResponse(`${req.path} is not valid path resource.`))
}

function fourOhFiveHandler(req, res, next) {
  return res
          .status(StatusCodes.METHOD_NOT_ALLOWED)
          .json(apiBadRequestResponse(`${req.method} is not supported to this path.`))

}

function globalErrorHandler(err, req, res, next) {
  return res
          .status( err.code || StatusCodes.INTERNAL_SERVER_ERROR )
          .json(apiResponse(err.code || StatusCodes.INTERNAL_SERVER_ERROR, err.status || 'INTERNAL_SERVER_ERROR', err.message))
}

module.exports = {
  bodyParserHandler,
  fourOhFourHandler,
  fourOhFiveHandler,
  globalErrorHandler
};