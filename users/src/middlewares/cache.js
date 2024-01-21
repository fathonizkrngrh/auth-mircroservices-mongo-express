const { StatusCodes } = require("http-status-codes");
const { apiResponse } = require("../utils/response");
const client = require("../config/redis");

module.exports = {
  cache: async (req, res, next) => {
    try {
        const url = req.originalUrl;
        
        const cacheKey = url.split('?')[0] + '/'
        console.log(cacheKey)

        const data = await client.get(cacheKey);
        if (data !== null) {
            return res
                .status(StatusCodes.OK)
                .json(apiResponse(StatusCodes.OK, "OK", "Successfully get data", JSON.parse(data)));
        }

        next();
    } catch (e) {
        console.log("err", e)
        return res
            .status(e.code || StatusCodes.INTERNAL_SERVER_ERROR)
            .json( apiResponse(e.code || StatusCodes.INTERNAL_SERVER_ERROR, e.status || 'INTERNAL_SERVER_ERROR', e.message))
    }
  },
  invalidateCache: (cacheKey) => {
    console.log(cacheKey)
    client.del(cacheKey, (err, response) => {
        console.log(response)
        if (err){
            return res
                .status(e.code || StatusCodes.INTERNAL_SERVER_ERROR)
                .json( apiResponse(e.code || StatusCodes.INTERNAL_SERVER_ERROR, e.status || 'INTERNAL_SERVER_ERROR', e.message))
        
        };
        console.log(`Cache key "${cacheKey}" invalidated`);
    });
  }
};
