// models/Bakery.js
module.exports = (sequelize, DataTypes) => {
  const Bakery = sequelize.define('Bakery', {
    bakery_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    name: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING },
    rating: { type: DataTypes.DECIMAL(3,2), defaultValue: 0 },
    keywords: { type: DataTypes.JSON }
  }, {
    tableName: 'Bakery',
    freezeTableName: true,
    timestamps: false
  });

  return Bakery;
};
