module.exports = (sequelize, DataTypes) => {
  const CreditHistorySummary = sequelize.define(
    'CreditHistorySummary',
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      documentNumber: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true,
        field: 'document_number',
      },
      totalOpenAccounts: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: 'total_open_accounts',
      },
      totalCurrentBalance: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        field: 'total_current_balance',
      },
      maxDaysPastDue: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: 'max_days_past_due',
      },
      creditHistoryLevel: {
        type: DataTypes.STRING(50),
        field: 'credit_history_level',
      },
      lastBureauUpdateAt: {
        type: DataTypes.DATE,
        field: 'last_bureau_update_at',
      },
      createdAt: {
        type: DataTypes.DATE,
        field: 'created_at',
      },
      updatedAt: {
        type: DataTypes.DATE,
        field: 'updated_at',
      },
    },
    {
      tableName: 'credit_history_summary',
      schema: process.env.DB_SCHEMA,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return CreditHistorySummary;
};
