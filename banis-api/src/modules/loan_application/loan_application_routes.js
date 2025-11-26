const express = require('express');
const { check, validationResult } = require('express-validator');
const { fieldValidation } = require("../../middlewares/field_validations_middleware");
const router = express.Router();

const controller = require("./loan_application_controller");
const { sessionMiddleware } = require('../../middlewares/session_middleware');

router.post('/send', [
    check('documentNumber', 'documentNumber is a required field').notEmpty(),
    check('fullName', 'fullName is a required field').notEmpty(),
    check('email', 'email is a required field').notEmpty(),
    check('requestedAmount', 'requestedAmount is a required field').notEmpty(),
    check('termMonths', 'termMonths is a required field').notEmpty(),
    check('purpose', 'purpose is a required field').notEmpty(),
    check('monthlyIncome', 'monthlyIncome is a required field').notEmpty(),
    check('monthlyExpenses', 'monthlyExpenses is a required field').notEmpty(),
    fieldValidation,
],controller.send);

router.post('/channge_manual_decision', [
    check('loanApplicationId', 'loanApplicationId is a required field').notEmpty(),
    check('newManualStatus', 'newManualStatus is a required field').notEmpty(),
    fieldValidation,
    sessionMiddleware,
],controller.changeManualDecision);

router.post('/finalize', [
    check('loanApplicationId', 'loanApplicationId is a required field').notEmpty(),
    check('action', 'action is a required field').notEmpty(),
    fieldValidation,
    sessionMiddleware,
],controller.finalizeLoanApplication);


module.exports = router;