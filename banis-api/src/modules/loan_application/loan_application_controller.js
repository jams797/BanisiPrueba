const { generalResponse, STATUS } = require("../../helpers/general_response");

const bll = require("./loan_application_bll");

exports.listAllLoanApplications = async (req,res) => {
    const data = await bll.listAllLoanApplications();
    if(!data[0]) return generalResponse(res, STATUS.NOT_FOUNDED, null, data[1]);
    return generalResponse(res, STATUS.OK, data[1], null);
}

exports.send = async (req,res) => {
    const data = await bll.send(req.body);
    if(!data[0]) return generalResponse(res, STATUS.NOT_FOUNDED, null, data[1]);
    return generalResponse(res, STATUS.OK, data[1], null);
}

exports.changeManualDecision = async (req,res) => {
    const data = await bll.changeManualDecision(req.body.loanApplicationId, req.body.newManualStatus);
    if(!data[0]) return generalResponse(res, STATUS.NOT_FOUNDED, null, data[1]);
    return generalResponse(res, STATUS.OK, data[1], null);
}


exports.finalizeLoanApplication = async (req,res) => {
    const data = await bll.finalizeLoanApplication(req.body.loanApplicationId, req.body.action);
    if(!data[0]) return generalResponse(res, STATUS.NOT_FOUNDED, null, data[1]);
    return generalResponse(res, STATUS.OK, data[1], null);
}