module.exports = (sequelize, DataTypes) => {
    const Favorite = sequelize.define('Favorite', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      bakeryId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    }, {
      indexes: [
        {
          unique: true,
          fields: ['userId', 'bakeryId']
        }
      ]
    });
  
    return Favorite;
  };
  