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
    });
  
    return Bakery;
  };
  