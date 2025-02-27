// models/FavoriteBackery.js
module.exports = (sequelize, DataTypes) => {
  const FavoriteBackery = sequelize.define('FavoriteBakery', {
    user_id: {
      type: DataTypes.BIGINT,
      primaryKey: true
    },
    bakery_id: {
      type: DataTypes.BIGINT,
      primaryKey: true
    }
  }, {
    tableName: 'FavoriteBakery',
    freezeTableName: true,
    timestamps: false
  });

  return FavoriteBackery;
};
