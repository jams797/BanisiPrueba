module.exports = (sequelize, DataTypes) => {
  const LoanManualDecision = sequelize.define(
    'LoanManualDecision',
    {
      code: {
        type: DataTypes.STRING(50),
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
    },
    {
      tableName: 'loan_manual_decisions',
      schema: process.env.DB_SCHEMA,
      timestamps: false,
    }
  );

  return LoanManualDecision;
};
