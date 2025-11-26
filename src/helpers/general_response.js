
/**
* @param {Response} res - La respuesta del api.
* @param {Number} statusCode - El estatus de la respuesta del api.
* @param {any} result - La data a retornar.
* @param {any} error - El error a retornar.
* @return {Promise<Respose>} - retorna la respuesta final de la api.
*/
async function generalResponse(res, statusCode, result = null, error = null) {
    return res.status(statusCode || 500).json({
        error: error,
        status: (error != null) ? false : true,
        result: result
    });
}

const STATUS = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    NOT_MODIFIED: 304,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUNDED: 404,
    CONFLICT: 409
}

module.exports = {
    generalResponse, STATUS
}