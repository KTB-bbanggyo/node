module.exports = (sequelize, DataTypes) => {
  const Bakery = sequelize.define('Bakery', {
    bakery_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: DataTypes.STRING,
    description: DataTypes.TEXT,
    rating: DataTypes.FLOAT,
  }, {
    tableName: 'Bakery',  // Sequelize가 자동으로 복수형으로 만들지 않도록 지정
  });

  return Bakery;
};
