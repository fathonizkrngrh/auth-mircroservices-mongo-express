const axios = require("axios")
const { StatusCodes } = require("http-status-codes");
const { apiResponse } = require("../utils/response");

const authUrl = process.env.AUTH_URL || "http://localhost:4000/api/auth/token";

module.exports = {
  authentication: async (req, res, next) => {
    try {
        const bearer = req.headers["authorization"];
        if (!bearer) {
            return res
                .status(StatusCodes.UNAUTHORIZED)
                .json( apiResponse(StatusCodes.UNAUTHORIZED,"UNAUTHORIZED", "Unauthorized. Please login to continue."));
        }

        const token = bearer.split(' ')[1];
        if (!token) {
            return res
                .status(StatusCodes.UNAUTHORIZED)
                .json( apiResponse(StatusCodes.UNAUTHORIZED,"UNAUTHORIZED", "Unauthorized. Please login to continue."));
        }

        const res = await axios({ method: 'post', url: authUrl, data: { token }})
        req.admin = res.data.data;
        
        next();
    } catch (e) {
        if (e.response) {
            const err = e.response.data
            return res
                .status(StatusCodes.UNAUTHORIZED)
                .json( apiResponse(err.code || StatusCodes.UNAUTHORIZED, err.status || 'UNAUTHORIZHED', err.message))
        }

        console.log("err", e)
        return res
            .status(e.code || StatusCodes.INTERNAL_SERVER_ERROR)
            .json( apiResponse(e.code || StatusCodes.INTERNAL_SERVER_ERROR, e.status || 'INTERNAL_SERVER_ERROR', e.message))
    }
  },
};
