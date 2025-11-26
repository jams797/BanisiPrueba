module.exports = (sequelize, DataTypes) => {
  const LoanApplication = sequelize.define(
    'LoanApplication',
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },

      // Datos del cliente
      documentNumber: {
        type: DataTypes.STRING(30),
        allowNull: false,
        field: 'document_number',
      },
      fullName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        field: 'full_name',
      },
      email: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      phoneNumber: {
        type: DataTypes.STRING(30),
        field: 'phone_number',
      },

      // Datos del préstamo
      requestedAmount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        field: 'requested_amount',
      },
      termMonths: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'term_months',
      },
      purpose: {
        type: DataTypes.TEXT,
      },

      // Variables para score
      monthlyIncome: {
        type: DataTypes.DECIMAL(15, 2),
        field: 'monthly_income',
      },
      monthlyExpenses: {
        type: DataTypes.DECIMAL(15, 2),
        field: 'monthly_expenses',
      },

      // Resultado score
      pointScore: {
        type: DataTypes.DECIMAL(5, 2),
        field: 'point_score',
      },

      automaticDecisionCode: {
        type: DataTypes.STRING(50),
        field: 'automatic_decision_code',
      },
      manualDecisionCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'pending',
        field: 'manual_decision_code',
      },
      statusCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'submitted',
        field: 'status_code',
      },

      // Trazabilidad
      submittedAt: {
        type: DataTypes.DATE,
        field: 'submitted_at',
      },
      autoDecidedAt: {
        type: DataTypes.DATE,
        field: 'auto_decided_at',
      },
      manuallyDecidedAt: {
        type: DataTypes.DATE,
        field: 'manually_decided_at',
      },
      createdBy: {
        type: DataTypes.STRING(100),
        field: 'created_by',
      },
      updatedBy: {
        type: DataTypes.STRING(100),
        field: 'updated_by',
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
      tableName: 'loan_applications',
      schema: process.env.DB_SCHEMA,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return LoanApplication;
};