module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    profile: {
      type: DataTypes.TEXT
    },
    preferences: {
      type: DataTypes.JSON,
      defaultValue: {}
    }
  }, {
    tableName: 'Users',    // Sequelize가 자동으로 복수형 변환하지 않도록
    timestamps: false,      // createdAt, updatedAt 자동 생성 막기
    freezeTableName: true   // 모델명이 그대로 테이블명으로 사용되도록 강제
  });

  return User;
};
