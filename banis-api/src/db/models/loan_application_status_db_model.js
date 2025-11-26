module.exports = (sequelize, DataTypes) => {
  const LoanApplicationStatus = sequelize.define(
    'LoanApplicationStatus',
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
      sortOrder: {
        type: DataTypes.INTEGER,
        field: 'sort_order',
      },
      isFinal: {
        type: DataTypes.BOOLEAN,
        field: 'is_final',
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      tableName: 'loan_application_statuses',
      schema: process.env.DB_SCHEMA,
      timestamps: false,
    }
  );

  return LoanApplicationStatus;
};
