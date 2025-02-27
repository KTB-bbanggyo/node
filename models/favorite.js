// models/FavoriteBackery.js
module.exports = (sequelize, DataTypes) => {
  const FavoriteBackery = sequelize.define('FavoriteBackery', {
    user_id: {
      type: DataTypes.BIGINT,
      primaryKey: true
    },
    bakery_id: {
      type: DataTypes.BIGINT,
      primaryKey: true
    }
  }, {
    tableName: 'FavoriteBackery',
    freezeTableName: true,
    timestamps: false
  });

  return FavoriteBackery;
};
