const { validationResult } = require('express-validator');
const { generalResponse, STATUS } = require("../helpers/general_response");
const { GLOBAL_ERRORS_0000 } = require("./general_errors");

const fieldValidation = (req, res, next) => {
    const errores = validationResult( req );

    if ( !errores.isEmpty() ) {
        return generalResponse(res,STATUS.BAD_REQUEST, null, {...GLOBAL_ERRORS_0000['0003'],fields:errores.mapped()});
    }
    next();
}

module.exports = {
    fieldValidation
}