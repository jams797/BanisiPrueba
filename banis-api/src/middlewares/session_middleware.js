const { validationResult } = require("express-validator");
const { generalResponse, STATUS } = require("../helpers/general_response");
const { GLOBAL_ERRORS_0000 } = require("./general_errors");
const { validateJwt } = require("../helpers/jwt_helper");

const sessionMiddleware = (req, res, next) => {
    const jwt = req.headers['Authorization'] ?? req.headers['authorization'];

    if (jwt == null) return generalResponse(res,STATUS.UNAUTHORIZED, null, {...GLOBAL_ERRORS_0000['0000'],});
    const jwtDecoded = validateJwt(jwt);

    if (jwtDecoded == null) return generalResponse(res,STATUS.UNAUTHORIZED, null, {...GLOBAL_ERRORS_0000['0001']});

    res.locals.dataSession = jwtDecoded;

    next();
}

module.exports = {
    sessionMiddleware
}