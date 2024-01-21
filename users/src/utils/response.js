const { StatusCodes } = require("http-status-codes");

const errorsCustomMessage = (errors) => {
    return errors.details.reduce(
        (acc, curr) => ({
            ...acc,
            [curr.path]: curr.message,
        }),
        {}
    );
};

module.exports = {
    /**
     * @param {number} code
     * @param {string} status
     * @param {string} message
     * @param {*} [data: {}] data
     * @returns {{ code: number, status: string, message: string, data: * }}
     * @description This function is used to return a custom response
     */
    apiResponse: (code, status, message, data) => {
        const result = {};
        result.code = code;
        result.status = status;
        result.message = message;
        result.data = data;

        return result;
    },
    apiResponseValidationError: (errors) => {
        const result = {};
        result.code = StatusCodes.UNPROCESSABLE_ENTITY;
        result.status = "UNPROCESSABLE_ENTITY";
        result.message = "The given data was invalid.";
        result.errors = errorsCustomMessage(errors);

        return result;
    },
    /**
     * @param {string} message
     * @returns {{ code: 400, status: "BAD_REQUEST", message: string }}
     * @example apiBadRequestResponse('Bad Request Happened');
     * @description This function is used to return response with status code 400
     */
    apiBadRequestResponse: (message) => {
        const result = {};
        result.code = StatusCodes.BAD_REQUEST;
        result.status = "BAD_REQUEST";
        result.message = message;

        return result;
    },
    /**
     * @param {string} message
     * @returns {{ code: 404, status: "NOT_FOUND", message: string }}
     * @example throw apiNotFoundResponse('Data not found');
     * @description This function is used to return response with status code 404
     */
    apiNotFoundResponse: (message) => {
        const result = {};
        result.code = StatusCodes.NOT_FOUND;
        result.status = "NOT_FOUND";
        result.message = message;

        return result;
    },
    /**
     * @param {string} message
     * @returns {{ code: 429, status: "TOO_MANY_REQUESTS", message: string }}
     * @example throw apiTooManyRequestsResponse('Too many requests');
     * @description This function is used to return response with status code 429
     */
    apiTooManyRequestResponse: (message) => {
        const result = {};
        result.code = StatusCodes.TOO_MANY_REQUESTS;
        result.status = "TOO_MANY_REQUESTS";
        result.message = message;

        return result;
    },
    /**
     * @param {string} message
     * @returns {{ code: 403, status: "FORBIDDEN", message: string }}
     * @example throw apiForbiddenResponse('Forbidden');
     * @description This function is used to return response with status code 403
     */
    apiForbiddenResponse: (message) => {
        const result = {};
        result.code = StatusCodes.FORBIDDEN;
        result.status = "FORBIDDEN";
        result.message = message;

        return result;
    }
};
