const DECISION_AUTOMATIC_STATUS = {
    APPROVED: 'approved',
    REJECTED: 'rejected',
    IN_REVIEW: 'in_review'
}

const DECISION_DB_AUTOMATIC_STATUS = {
    APPROVED: 'approved',
    REJECTED: 'rejected',
    MANUAL_REVIEW: 'manual_review'
}

const DECISION_DB_MANUAL_STATUS = {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected'
}

const LOAN_APPLICATION_DB_STATUS = {
    SUBMITTED: 'submitted',
    IN_REVIEW: 'in_review',
    APPROVED: 'approved',
    REJECTED: 'rejected',
    DISBURSED: 'disbursed',
    CANCELLED: 'cancelled'
}


module.exports = {
    DECISION_AUTOMATIC_STATUS,
    DECISION_DB_AUTOMATIC_STATUS,
    DECISION_DB_MANUAL_STATUS,
    LOAN_APPLICATION_DB_STATUS
}