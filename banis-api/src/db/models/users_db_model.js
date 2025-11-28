module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define(
    'Users',
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      fullName: {
        field: 'full_name',
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      pass: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      otp: {
        type: DataTypes.STRING(6),
        allowNull: true,
      },
      otpCreated: {
        type: DataTypes.DATE,
        field: 'otp_created',
      },
    },
    {
      tableName: 'users',
      schema: process.env.DB_SCHEMA,
      timestamps: false,
    }
  );

  return Users;
};
