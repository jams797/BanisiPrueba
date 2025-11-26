
const { Sequelize, DataTypes } = require('sequelize');


const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
  }
);

// Modelos
const db_LoanApplicationStatus = require('./models/loan_application_status_db_model')(sequelize, DataTypes);
const db_LoanAutoDecision      = require('./models/loan_auto_decision_db_model')(sequelize, DataTypes);
const db_LoanManualDecision    = require('./models/loan_manual_decision_db_model')(sequelize, DataTypes);
const db_CreditHistorySummary  = require('./models/credit_history_summary_db_model')(sequelize, DataTypes);
const db_LoanApplication       = require('./models/loan_application_db_model')(sequelize, DataTypes);
const db_Users                 = require('./models/users_db_model')(sequelize, DataTypes);

// ========================
// Associations
// ========================

// loan_applications.status_code -> loan_application_statuses.code
db_LoanApplicationStatus.hasMany(db_LoanApplication, {
  foreignKey: 'status_code',
  sourceKey: 'code',
  as: 'applications',
});
db_LoanApplication.belongsTo(db_LoanApplicationStatus, {
  foreignKey: 'status_code',
  targetKey: 'code',
  as: 'status',
});

// loan_applications.automatic_decision_code -> loan_auto_decisions.code
db_LoanAutoDecision.hasMany(db_LoanApplication, {
  foreignKey: 'automatic_decision_code',
  sourceKey: 'code',
  as: 'applicationsWithAutoDecision',
});
db_LoanApplication.belongsTo(db_LoanAutoDecision, {
  foreignKey: 'automatic_decision_code',
  targetKey: 'code',
  as: 'automaticDecision',
});

// loan_applications.manual_decision_code -> loan_manual_decisions.code
db_LoanManualDecision.hasMany(db_LoanApplication, {
  foreignKey: 'manual_decision_code',
  sourceKey: 'code',
  as: 'applicationsWithManualDecision',
});
db_LoanApplication.belongsTo(db_LoanManualDecision, {
  foreignKey: 'manual_decision_code',
  targetKey: 'code',
  as: 'manualDecision',
});

// Relación por document_number (no hay FK físico, pero sirve para queries)
// db_CreditHistorySummary.hasMany(db_LoanApplication, {
//   foreignKey: 'document_number',
//   sourceKey: 'document_number',
//   as: 'loanApplications',
// });
// db_LoanApplication.belongsTo(db_CreditHistorySummary, {
//   foreignKey: 'document_number',
//   targetKey: 'document_number',
//   as: 'creditHistory',
// });

// Exportar
module.exports = {
  sequelize,
  Sequelize,
  db_LoanApplicationStatus,
  db_LoanAutoDecision,
  db_LoanManualDecision,
  db_CreditHistorySummary,
  db_LoanApplication,
  db_Users,
};
