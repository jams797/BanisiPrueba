
const jwt = require('jsonwebtoken');

const key = process.env.JWT_KEY;
const expired = process.env.JWT_EXPIRED;
const version = process.env.JWT_VERSION;

function jwtGenerated(data) {
    try{
        return jwt.sign({
            // data: JSON.stringify({
            //     data: data,
            //     version: version,
            // }),
            data: ({
                data: data,
                version: version,
            }),
        }, key, { expiresIn: expired });
    } catch (e) {
        console.log(e);
        return null;
    }
}

function validateJwt(jwtString) {
    try {
        var decoded = jwt.verify(jwtString, key);

        if (decoded.data.version != version) return null;

        return decoded.data.data;
    } catch (e) {
        return null;
    }
}


module.exports = {
    jwtGenerated,
    validateJwt,
}