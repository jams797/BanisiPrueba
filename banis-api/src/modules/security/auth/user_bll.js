const { LIST_ERRORS } = require("./auth_user_errors");
const { sequelize, db_Users } = require("../../../db/config_db");
const bcrypt = require('bcrypt');
const { encriptPassword } = require("../../../helpers/method_helpers");
const { jwtGenerated } = require("../../../helpers/jwt_helper");

exports.login = async (req) => {
    try{

        const users = await db_Users.findAll({
            where: {
                email: req.email,
            },
            limit: 10,
        });

        if(users.length === 0) return [false, LIST_ERRORS[4003].message];

        if(!await bcrypt.compare(req.pass, users[0].pass)) return [false, LIST_ERRORS[4003].message];

        const dataUser = users[0];

        return [true, {
            id: dataUser.id,
            fullName: dataUser.fullName,
            token: jwtGenerated({
                userId: dataUser.id,
            }),
        }];

    } catch (_) {
        console.log(_);
        return [false, LIST_ERRORS[5555]];
    }
}