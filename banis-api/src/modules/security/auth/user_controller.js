const { generalResponse, STATUS } = require("../../../helpers/general_response");

const userBll = require("./user_bll");

exports.login = async (req,res) => {
    const data = await userBll.login(req.body);
    if(!data[0]) return generalResponse(res, STATUS.NOT_FOUNDED, null, data[1]);
    return generalResponse(res, STATUS.OK, data[1], null);
}