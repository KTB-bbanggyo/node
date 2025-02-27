module.exports = (sequelize, DataTypes) => {
  const Bakery = sequelize.define('Bakery', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    rating: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    }
  }, {
    tableName: 'Bakery',  // MySQL 테이블 이름 강제 설정
    freezeTableName: true  // Sequelize의 자동 복수형 변환 방지
  });

  return Bakery;
};
