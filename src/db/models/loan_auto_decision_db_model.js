module.exports = (sequelize, DataTypes) => {
  const LoanAutoDecision = sequelize.define(
    'LoanAutoDecision',
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
      tableName: 'loan_auto_decisions',
      schema: process.env.DB_SCHEMA,
      timestamps: false,
    }
  );

  return LoanAutoDecision;
};
