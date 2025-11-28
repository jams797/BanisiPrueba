const { LIST_ERRORS } = require("./auth_user_errors");
const { sequelize, db_Users } = require("../../../db/config_db");
const bcrypt = require('bcrypt');
const { encriptPassword } = require("../../../helpers/method_helpers");
const { jwtGenerated } = require("../../../helpers/jwt_helper");
const { smtpSendMail } = require("../../../helpers/smtp_helper");

exports.login = async (req) => {
    try{

        if(req.otp != null) {
            if(req.otp.length !== 6) return [false, LIST_ERRORS[4004].message];
        }

        const users = await db_Users.findAll({
            where: {
                email: req.email,
            },
            limit: 10,
        });

        if(users.length === 0) return [false, LIST_ERRORS[4003].message];

        if(!await bcrypt.compare(req.pass, users[0].pass)) return [false, LIST_ERRORS[4003].message];

        if(req.otp == null) {
            const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

            let otpSend = "";
            if(users[0].otp != null && users[0].otpCreated != null && users[0].otpCreated > new Date() - (5 * 60 * 1000)) {
                otpSend = users[0].otp;
            } else {
                users[0].dataValues.otp = generatedOtp;
                users[0].dataValues.otpCreated = new Date();
                await db_Users.upsert(users[0].dataValues);
                otpSend = generatedOtp;
            }

            smtpSendMail('OTP', `Su OTP es: ${otpSend}`, users[0].email, null, null, null);

            return [true, null];
        }

        const dataUser = users[0];

        if(dataUser.otp !== req.otp || dataUser.otpCreated < new Date() - (5 * 60 * 1000)) return [false, LIST_ERRORS[4005].message];


        dataUser.dataValues.otp = null;
        await db_Users.upsert(dataUser.dataValues);

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