const Joi = require('joi');
const passwordComplexity = require("joi-password-complexity");
const { StatusCodes: status } = require('http-status-codes');
const { apiBadRequestResponse, apiResponseValidationError } = require('../response');

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
    lowerCase: 0,
    upperCase: 0,
    numeric: 0,
    symbol: 0,
    requirementCount: 0,
};

module.exports = {
    signup: async (req, res, next) => {
        const body = Joi.object().keys({
            email: Joi.string().required().email(),
            password: passwordComplexity(complexityOptions).required(),
            passwordConfirmation: Joi.string().required().valid(Joi.ref("password")).options({ messages: { "any.only": "{{#label}} does not match" } }),
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
    signin: async (req, res, next) => {
        const body = Joi.object().keys({
            email: Joi.string().required().email(),
            password: passwordComplexity(complexityOptions).required(),
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
    checkToken: async (req, res, next) => {
        const body = Joi.object().keys({
            token: Joi.string().required()
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