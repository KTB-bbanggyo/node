// models/Bakeries.js
module.exports = (sequelize, DataTypes) => {
    const Bakeries = sequelize.define('Bakeries', {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      bakeries_list: {
        type: DataTypes.JSON,
        allowNull: false
      }
    }, {
      tableName: 'Bakeries',   // DB 테이블명
      freezeTableName: true,   // 복수형 변환 막기
      timestamps: true         // createdAt, updatedAt 자동
    });
    return Bakeries;
  };
  