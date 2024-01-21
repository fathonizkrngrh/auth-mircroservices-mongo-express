const Joi = require('joi');
const { StatusCodes: status } = require('http-status-codes');
const { apiBadRequestResponse, apiResponseValidationError } = require('../response');

const objectId = (value, helpers) => {
    if (!value.match(/^[0-9a-fA-F]{24}$/)) {
        return helpers.message('"{{#label}}" must be a valid mongo id');
    }
    return value;
};

const options = {
    errors: {
      wrap: {
        label: "",
      },
    },
    abortEarly: false,
};
  
const complexityOptions = {
    min: 8,
    max: 25,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 0,
    requirementCount: 0,
};

module.exports = {
    createUser: async (req, res, next) => {
        const body = Joi.object().keys({
            emailAddress: Joi.string().required().email(),
            userName: Joi.string().required(),
            identityNumber: Joi.string().pattern(/^[0-9]+$/).required().min(10),
        })

        try {
            await body.validateAsync(req.body, options);
            next();
          } catch (e) {
            return res
              .status(status.BAD_REQUEST)
              .json(apiResponseValidationError(e));
          }
    },
    getUsers: async (req, res, next) => {
        const schema = Joi.object().keys({
            sortBy: Joi.string(),
            sortType: Joi.number().integer(),
            limit: Joi.number().integer(),
            page: Joi.number().integer(),
        })
        
        try {
            await schema.validateAsync(req.query, options);
            next();
        } catch (e) {
            return res
            .status(status.BAD_REQUEST)
            .json(apiResponseValidationError(e));
        }
    },
    getUser: async (req, res, next) => {
        const schema = Joi.object().keys({
            accountNumber: Joi.string().pattern(/^[0-9]+$/),
            identityNumber: Joi.string().pattern(/^[0-9]+$/),
        })
        
        try {
            await schema.validateAsync(req.query, options);
            next();
        } catch (e) {
            return res
            .status(status.BAD_REQUEST)
            .json(apiResponseValidationError(e));
        }
    },
    updateUser: async (req, res, next) => {
        const body = Joi.object().keys({
            id: Joi.string().custom(objectId).required(),
            emailAddress: Joi.string().email(),
            userName: Joi.string(),
            identityNumber: Joi.string().pattern(/^[0-9]+$/).min(10),
        })

        try {
            await body.validateAsync(req.body, options);
            next();
          } catch (e) {
            return res
              .status(status.BAD_REQUEST)
              .json(apiResponseValidationError(e));
          }
    },
    deleteUser: async (req, res, next) => {
        const body = Joi.object().keys({
            id: Joi.string().custom(objectId).required(),
        })

        try {
            await body.validateAsync(req.body, options);
            next();
          } catch (e) {
            return res
              .status(status.BAD_REQUEST)
              .json(apiResponseValidationError(e));
          }
    },
};