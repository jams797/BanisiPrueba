const { LIST_MESSAGES } = require("./loan_application_messages");
const { sequelize, db_LoanApplication } = require("../../db/config_db");
const { encriptPassword, sendMailByStatus, sendSmsByStatus } = require("../../helpers/method_helpers");
const { calculateDecision } = require("../../helpers/method_helpers");
const { DECISION_AUTOMATIC_STATUS, DECISION_DB_MANUAL_STATUS, LOAN_APPLICATION_DB_STATUS, DECISION_DB_AUTOMATIC_STATUS } = require("../../helpers/params_helper");

exports.send = async (req) => {
    try{

        const respCal = await calculateDecision(req);

        const dataLoanApp = {
            documentNumber: req.documentNumber,
            fullName: req.fullName,
            email: req.email,
            phoneNumber: req.phoneNumber,

            requestedAmount: req.requestedAmount,
            termMonths: req.termMonths,
            purpose: req.purpose,

            monthlyIncome: req.monthlyIncome,
            monthlyExpenses: req.monthlyExpenses,

            pointScore: respCal.pointScore,
            
            automaticDecisionCode: respCal.automaticDecisionCode,
            manualDecisionCode: null,
            statusCode: null,
        };

        let messageSend;

        switch(respCal.automaticDecisionCode) {
            case DECISION_AUTOMATIC_STATUS.APPROVED:
                dataLoanApp.automaticDecisionCode = DECISION_DB_AUTOMATIC_STATUS.APPROVED;
                dataLoanApp.manualDecisionCode = DECISION_DB_MANUAL_STATUS.APPROVED;
                dataLoanApp.statusCode = LOAN_APPLICATION_DB_STATUS.APPROVED;
                messageSend = LIST_MESSAGES[2000];
                break;
            case DECISION_AUTOMATIC_STATUS.REJECTED:
                dataLoanApp.automaticDecisionCode = DECISION_DB_AUTOMATIC_STATUS.REJECTED;
                dataLoanApp.manualDecisionCode = DECISION_DB_MANUAL_STATUS.REJECTED;
                dataLoanApp.statusCode = LOAN_APPLICATION_DB_STATUS.REJECTED;
                messageSend = LIST_MESSAGES[2501];
                break;
            case DECISION_AUTOMATIC_STATUS.IN_REVIEW:
                dataLoanApp.automaticDecisionCode = DECISION_DB_AUTOMATIC_STATUS.MANUAL_REVIEW;
                dataLoanApp.manualDecisionCode = DECISION_DB_MANUAL_STATUS.PENDING;
                dataLoanApp.statusCode = LOAN_APPLICATION_DB_STATUS.IN_REVIEW;
                messageSend = LIST_MESSAGES[2502];
                break;
        }
        
        await sequelize.transaction(async (t) => {
            const newLoanApp = await db_LoanApplication.create(dataLoanApp, { transaction: t });
        });

        sendMailByStatus(dataLoanApp.email, respCal.automaticDecisionCode);
        sendSmsByStatus(dataLoanApp.phoneNumber, respCal.automaticDecisionCode);

        return [true, messageSend];

    } catch (_) {
        console.log(_);
        return [false, LIST_MESSAGES[5555]];
    }
}

exports.changeManualDecision = async (loanApplicationId, manualDecisionCode) => {
    try{

        const loanAppFind= await db_LoanApplication.findOne({
            where: {
                id: loanApplicationId,
            },
        });

        if(!loanAppFind) return [false, LIST_MESSAGES[5555]];

        if(loanAppFind.statusCode !== LOAN_APPLICATION_DB_STATUS.IN_REVIEW) {
            return [false, LIST_MESSAGES[5556]];
        }

        let statusCodeUpdate = null;

        switch(manualDecisionCode) {
            case DECISION_DB_MANUAL_STATUS.APPROVED:
                statusCodeUpdate = LOAN_APPLICATION_DB_STATUS.APPROVED;
                break;
            case DECISION_DB_MANUAL_STATUS.REJECTED:
                statusCodeUpdate = LOAN_APPLICATION_DB_STATUS.REJECTED;
                break;
        }

        if(!statusCodeUpdate) return [false, LIST_MESSAGES[5555]];

        loanAppFind.dataValues.manual_decision_code = manualDecisionCode;
        loanAppFind.dataValues.status_code = statusCodeUpdate;

        await db_LoanApplication.upsert(loanAppFind.dataValues);

        sendMailByStatus(loanAppFind.dataValues.email, manualDecisionCode);
        sendSmsByStatus(loanAppFind.dataValues.phoneNumber, manualDecisionCode);

        return [true, null];

    } catch (_) {
        console.log(_);
        return [false, LIST_MESSAGES[5555]];
    }
}

exports.finalizeLoanApplication = async (loanApplicationId, action) => {
    try{

        const loanAppFind= await db_LoanApplication.findOne({
            where: {
                id: loanApplicationId,
            },
        });

        if(!loanAppFind) return [false, LIST_MESSAGES[5555]];

        if(loanAppFind.statusCode !== LOAN_APPLICATION_DB_STATUS.APPROVED) {
            return [false, LIST_MESSAGES[5556]];
        }

        if(action === LOAN_APPLICATION_DB_STATUS.DISBURSED || action === LOAN_APPLICATION_DB_STATUS.CANCELLED) {
            loanAppFind.dataValues.status_code = action;
        } else {
            return [false, LIST_MESSAGES[5555]];
        }
        
        await db_LoanApplication.upsert(loanAppFind.dataValues);

        sendMailByStatus(loanAppFind.dataValues.email, action);
        sendSmsByStatus(loanAppFind.dataValues.phoneNumber, action);

        return [true, null];

    } catch (_) {
        console.log(_);
        return [false, LIST_MESSAGES[5555]];
    }
}