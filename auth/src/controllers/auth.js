const Admin = require('../models/admins')
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");
const { StatusCodes } = require('http-status-codes');
const { apiResponse, apiBadRequestResponse } = require('../utils/response');

const signup = async (req, res) => {
    const body = req.body

    const duplicateEmail = await Admin.findOne({ email: body.email });
    if (duplicateEmail) {
        return res.status(StatusCodes.BAD_REQUEST).json(apiBadRequestResponse("Email already used"));
    }
    
    const hashedPassword = await bcrypt.hash(body.password, 10)
    body.password = hashedPassword
    
    try {
        await Admin.create(body);
    
        return res
            .status(StatusCodes.CREATED)
            .json(apiResponse(StatusCodes.CREATED, "CREATED", "Success signup"));
    } catch (e) {
        console.log(e);
        return res
                .status(StatusCodes.CREATED)
                .json( apiResponse(e.code || StatusCodes.INTERNAL_SERVER_ERROR, e.status || 'INTERNAL_SERVER_ERROR', e.message))
    }
};

const signin = async (req, res) => {
    const body = req.body

    const admin = await Admin.findOne({ email: body.email });
    if (!admin) {
        return res.status(StatusCodes.BAD_REQUEST).json(apiBadRequestResponse("Admin not found."));
    }
    
    const checkPassword = await bcrypt.compare(body.password, admin.password)
    if (!checkPassword) {
        return res.status(StatusCodes.BAD_REQUEST).json(apiBadRequestResponse("Password does not match."));
    }

    try {
        const payload = {
            id: admin._id,
            email: admin.email,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY || "5EC123TK3Y", {
            expiresIn: "1d",
        });
    
        return res
            .status(StatusCodes.OK)
            .json(apiResponse(StatusCodes.OK, "OK", "Success signin", {token} ));
    } catch (e) {
        console.log(e);
        return res
                .status(StatusCodes.CREATED)
                .json( apiResponse(e.code || StatusCodes.INTERNAL_SERVER_ERROR, e.status || 'INTERNAL_SERVER_ERROR', e.message))
    }
};

const checkToken = async (req, res) => {
    const body = req.body

    try {
        const decoded = jwt.verify(body.token, process.env.JWT_SECRET_KEY  || "5EC123TK3Y")
        
        const admin = await Admin.findOne({ email: decoded.email, _id: decoded.id});
        if (!admin) {
            return res.status(StatusCodes.BAD_REQUEST).json(apiBadRequestResponse("Admin not found."));
        }

        return res
            .status(StatusCodes.OK)
            .json(apiResponse(StatusCodes.OK, "OK", "Success check token", { token: body.token, ...decoded}));
    } catch (e) {
        if (e.name === "JsonWebTokenError") {
            return res
                .status(StatusCodes.UNAUTHORIZED)
                .json(apiResponse(StatusCodes.UNAUTHORIZED, "UNAUTHORIZED", "Invalid token. Please login again."));
        }

        if (e.name === "TokenExpiredError") {
            return res
              .status(StatusCodes.UNAUTHORIZED)
              .json( apiResponse(StatusCodes.UNAUTHORIZED,"UNAUTHORIZED", "Token expired. Please login again."));
        }

        return res
                .status(StatusCodes.CREATED)
                .json( apiResponse(e.code || StatusCodes.INTERNAL_SERVER_ERROR, e.status || 'INTERNAL_SERVER_ERROR', e.message))
    }
};

module.exports = {
    signup,
    signin,
    checkToken
};