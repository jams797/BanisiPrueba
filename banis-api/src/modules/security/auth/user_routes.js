const express = require('express');
const { check, validationResult } = require('express-validator');
const { fieldValidation } = require("../../../middlewares/field_validations_middleware");
const router = express.Router();

const authController = require("./user_controller");

router.post('/login', [
    check('email', 'email is a required field').notEmpty(),
    check('pass', 'pass is a required field').notEmpty(),
    fieldValidation
],authController.login);


module.exports = router;