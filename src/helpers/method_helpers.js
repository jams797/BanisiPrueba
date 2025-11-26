
const bcrypt = require('bcrypt');
const { db_CreditHistorySummary } = require('../db/config_db');
const { DECISION_AUTOMATIC_STATUS, LOAN_APPLICATION_DB_STATUS } = require('./params_helper');
const { smtpSendMail } = require('./smtp_helper');
const { sendSms } = require('./twilo_helper');

exports.encriptPassword = async (password) => {
    const saltRounds = process.env.BCRYPT_SALT_ROUNDS || 10;
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(password, salt);
}

exports.comparePassword = async (password, passwordHash) => {
    return await bcrypt.compare(password, passwordHash);
}

exports.calculateDecision = async (data) => {
    try{

        const chDB = await db_CreditHistorySummary.findOne({
            where: {
                documentNumber: data.documentNumber,
            },
            limit: 10,
        });

        const ch = chDB || {
            creditHistoryLevel: 'none',
            totalOpenAccounts: 0,
            totalCurrentBalance: 0,
            maxDaysPastDue: 0,
        };

        // Retornar al menos un valor para que no se dividan valores irracionales
        const safeMonthlyIncome = Math.max(Number(data.monthlyIncome) || 0, 1);

        const disposableIncome = safeMonthlyIncome - Number(data.monthlyExpenses) - Number(ch.totalCurrentBalance);

        const monthlyInstallment = Number(data.requestedAmount) / Number(data.termMonths);

        const safeDisposableIncome = disposableIncome > 0 ? disposableIncome : 1;

        // const totalDebt = (Number(ch.totalCurrentBalance) || 0);
        // const dti = (totalDebt + Number(data.requestedAmount || 0)) / safeMonthlyIncome;
        const dti = monthlyInstallment / safeDisposableIncome;

        // =========================
        // Cálculo del score (0-100)
        // =========================
        let pointScore = 100;

        // Penalización por DTI
        if (dti > 0.7) pointScore -= 40;
        else if (dti > 0.5) pointScore -= 25;
        else if (dti > 0.4) pointScore -= 15;
        else if (dti > 0.3) pointScore -= 5;

        // Penalización por dias de mora
        if (ch.maxDaysPastDue > 120) pointScore -= 40;
        else if (ch.maxDaysPastDue > 90) pointScore -= 30;
        else if (ch.maxDaysPastDue > 60) pointScore -= 20;
        else if (ch.maxDaysPastDue > 30) pointScore -= 10;

        // Penalización/bono por creditHistoryLevel
        switch (ch.creditHistoryLevel) {
            case 'excellent':
            pointScore += 5;
            break;
            case 'good':
            // sin cambio
            break;
            case 'fair':
            pointScore -= 10;
            break;
            case 'poor':
            pointScore -= 25;
            break;
            case 'none':
            default:
            pointScore -= 5; // sin historial, pequeño castigo
            break;
        }


        // =========================
        // Proceso de decisión automática
        // =========================

        let automaticDecisionCode = DECISION_AUTOMATIC_STATUS.IN_REVIEW;

        // RECHAZO AUTOMÁTICO (riesgo muy alto)
        if (
            pointScore < 40 ||
            dti > 0.7 ||
            ch.maxDaysPastDue > 120 ||
            ch.creditHistoryLevel === 'poor'
        ) {
            automaticDecisionCode = DECISION_AUTOMATIC_STATUS.REJECTED;
        }
        // APROBACIÓN AUTOMÁTICA (riesgo bajo)
        else if (
            pointScore >= 70 &&
            dti <= 0.4 &&
            (ch.creditHistoryLevel === 'excellent' || ch.creditHistoryLevel === 'good') &&
            ch.maxDaysPastDue <= 30
        ) {
            automaticDecisionCode = DECISION_AUTOMATIC_STATUS.APPROVED;
        }
        // Si no cumple ni para aprobar ni para rechazar -> revisión manual
        else {
            automaticDecisionCode = DECISION_AUTOMATIC_STATUS.IN_REVIEW;
        }

        return {
            pointScore,
            automaticDecisionCode, // 'approved' | 'rejected' | 'manual_review'
        };

    } catch (_) {
        console.log(_);
        return [false, LIST_ERRORS[5555]];
    }
}

exports.sendMailByStatus = async (toEmail, statusCode) => {
    try{
        let subject = '';
        let html = '';

        switch(statusCode) {
            case DECISION_AUTOMATIC_STATUS.APPROVED:
                subject = 'Solicitud aprobada';
                html = '<p>Nos complace informarle que su solicitud de préstamo ha sido aprobada, nos pondremos en contacto con usted pronto.</p>';
                break;
            case DECISION_AUTOMATIC_STATUS.REJECTED:
                subject = 'Solicitud rechazada';
                html = '<p>Lamentamos informarle que su solicitud de préstamo ha sido rechazada. Gracias por considerar nuestros servicios.</p>';
                break;
            case DECISION_AUTOMATIC_STATUS.IN_REVIEW:
                subject = 'Solicitud en revisión';
                html = '<p>Su solicitud de préstamo está actualmente en revisión. Nos comunicaremos con usted una vez que se haya tomado una decisión.</p>';
                break;
            case LOAN_APPLICATION_DB_STATUS.DISBURSED:
                subject = 'Préstamo desembolsado';
                html = '<p>Nos complace informarle que su préstamo ha sido desembolsado con éxito. Por favor, revise los detalles en su cuenta.</p>';
                break;
            case LOAN_APPLICATION_DB_STATUS.CANCELLED:
                subject = 'Solicitud cancelada';
                html = '<p>Su solicitud de préstamo ha sido cancelada según su petición. Si tiene alguna pregunta, no dude en contactarnos.</p>';
                break;
            default:
                return [false, null];
        }

        await smtpSendMail(subject, html, toEmail, null, null, null);

        return [true, null];

    }
    catch (e) {
        console.log(e);
        return [false, null];
    }
}

exports.sendSmsByStatus = async (phone, statusCode) => {
    try{
        let message = '';

        switch(statusCode) {
            case DECISION_AUTOMATIC_STATUS.APPROVED:
                message = 'Su solicitud de préstamo ha sido aprobada. Nos pondremos en contacto con usted pronto.';
                break;
            case DECISION_AUTOMATIC_STATUS.REJECTED:
                message = 'Lamentamos informarle que su solicitud de préstamo ha sido rechazada.';
                break;
            case DECISION_AUTOMATIC_STATUS.IN_REVIEW:
                message = 'Su solicitud de préstamo está actualmente en revisión. Nos comunicaremos con usted pronto.';
                break;
            case LOAN_APPLICATION_DB_STATUS.DISBURSED:
                message = 'Su préstamo ha sido desembolsado con éxito. Por favor, revise los detalles en su cuenta.';
                break;
            case LOAN_APPLICATION_DB_STATUS.CANCELLED:
                message = 'Su solicitud de préstamo ha sido cancelada según su petición.';
                break;
            default:
                return [false, null];
        }

        await sendSms(phone, message);

        return [true, null];

    }
    catch (e) {
        console.log(e);
        return [false, null];
    }
}