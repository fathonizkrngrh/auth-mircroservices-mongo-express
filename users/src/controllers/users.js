const User = require('../models/users')
const { StatusCodes } = require('http-status-codes');
const { apiResponse, apiBadRequestResponse } = require('../utils/response');
const client = require("../config/redis");
const { invalidateCache } = require('../middlewares/cache');

const createUser = async (req, res) => {
    const body = req.body

    const duplicateEmail = await User.findOne({ emailAddress: body.emailAddress });
    if (duplicateEmail) {
        return res.status(StatusCodes.BAD_REQUEST).json(apiBadRequestResponse("Email already used"));
    }
    
    const duplicateIdentity = await User.findOne({ identityNumber: body.identityNumber });
    if (duplicateIdentity) {
        return res.status(StatusCodes.BAD_REQUEST).json(apiBadRequestResponse("Identity Number already exist"));
    }
    
    body.accountNumber = '123' + `${Math.floor(Date.now() / 1000)}`.padStart(20, 0)
    if (body.accountNumber) {
        const duplicateAccountNumber = await User.findOne({ identityNumber: body.identityNumber });
        if (duplicateAccountNumber) {
            return res.status(StatusCodes.BAD_REQUEST).json(apiBadRequestResponse("Account Number already exist"));
        }
    }
    
    try {
        const user = await User.create(body);

        const cacheKey = req.originalUrl.split('?')[0]

        invalidateCache(cacheKey)
    
        return res
            .status(StatusCodes.CREATED)
            .json(apiResponse(StatusCodes.CREATED, "CREATED", "Successfully created user", user));
    } catch (e) {
        console.log(e);
        return res
            .status(StatusCodes.CREATED)
            .json( apiResponse(e.code || StatusCodes.INTERNAL_SERVER_ERROR, e.status || 'INTERNAL_SERVER_ERROR', e.message))
    }
};

const getUsers = async (req, res) => {
    const { page = 0, limit = 10, sortBy, sortType } = req.query

    try {
        const users = await User.find().sort([[sortBy, sortType]]).limit(+limit).skip(+limit * +page);
    
        const cacheKey = req.originalUrl.split('?')[0] + '/'

        await client.setEx(cacheKey, 120, JSON.stringify(users));

        res
            .status(StatusCodes.OK)
            .json(apiResponse(StatusCodes.OK, "OK", "Successfully get users", users));
    } catch (e) {
        console.log(e);
        return res
            .status(StatusCodes.CREATED)
            .json( apiResponse(e.code || StatusCodes.INTERNAL_SERVER_ERROR, e.status || 'INTERNAL_SERVER_ERROR', e.message))
    }
};

const getUser = async (req, res) => {

    if (!req.query.accountNumber && !req.query.identityNumber) {
        return res.status(StatusCodes.BAD_REQUEST).json(apiBadRequestResponse("Request not accepted. Account Number or Identity Number is Required"));
    }
    if (req.query.accountNumber && req.query.identityNumber) {
        return res.status(StatusCodes.BAD_REQUEST).json(apiBadRequestResponse("Request not accepted. Choose whether to use an identity number or an account number."));
    }

    const where = (query) => ({
        ...query.accountNumber && { accountNumber: query.accountNumber},
        ...query.identityNumber && { identityNumber: query.identityNumber},
    })

    try {
        const user = await User.findOne(where(req.query));
        if (!user) {
            return res.status(StatusCodes.BAD_REQUEST).json(apiBadRequestResponse("User Not Found"));
        }
    
        res
            .status(StatusCodes.OK)
            .json(apiResponse(StatusCodes.OK, "OK", "Successfully get user", user));
    } catch (e) {
        console.log(e);
        return res
            .status(StatusCodes.CREATED)
            .json( apiResponse(e.code || StatusCodes.INTERNAL_SERVER_ERROR, e.status || 'INTERNAL_SERVER_ERROR', e.message))
    }
};

const updateUser = async (req, res) => {
    const body = req.body

    const user = await User.findById(body.id);
    if (!user) {
        return res.status(StatusCodes.BAD_REQUEST).json(apiBadRequestResponse("User Not Found"));
    }

    if (body.emailAddress) {
        const duplicateEmail = await User.findOne({ emailAddress: body.emailAddress, _id: { $ne: user._id } });
        if (duplicateEmail) {
            return res.status(StatusCodes.BAD_REQUEST).json(apiBadRequestResponse("Email already used"));
        }
    }
    
    if (body.identityNumber) {
        const duplicateIdentity = await User.findOne({ identityNumber: body.identityNumber, _id: { $ne: user._id } });
        if (duplicateIdentity) {
            return res.status(StatusCodes.BAD_REQUEST).json(apiBadRequestResponse("Identity Number already used"));
        }
    }
    
    try {
        Object.assign(user, body);
        console.log(user)
        await user.save();

        const cacheKey = req.originalUrl.split('?')[0]

        invalidateCache(cacheKey)
    
        return res
            .status(StatusCodes.OK)
            .json(apiResponse(StatusCodes.OK, "OK", "Successfully update user", user));
    } catch (e) {
        console.log(e);
        return res
            .status(StatusCodes.CREATED)
            .json( apiResponse(e.code || StatusCodes.INTERNAL_SERVER_ERROR, e.status || 'INTERNAL_SERVER_ERROR', e.message))
    }
};

const deleteUser = async (req, res) => {
    const body = req.body

    const user = await User.findById(body.id);
    if (!user) {
        return res.status(StatusCodes.BAD_REQUEST).json(apiBadRequestResponse("User Not Found"));
    }
    
    try {
        await user.remove();

        invalidateCache('/api/user/')
    
        return res
            .status(StatusCodes.OK)
            .json(apiResponse(StatusCodes.OK, "OK", `Successfully delete user with id ${body.id}`));
    } catch (e) {
        console.log(e);
        return res
            .status(StatusCodes.CREATED)
            .json( apiResponse(e.code || StatusCodes.INTERNAL_SERVER_ERROR, e.status || 'INTERNAL_SERVER_ERROR', e.message))
}
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};