const { Sequelize, DataTypes } = require('sequelize');

// 환경 변수
const DB_NAME = process.env.DB_NAME || 'bakery_db';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_HOST = process.env.DB_HOST || 'localhost';

// Sequelize 인스턴스 생성
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: 'mysql'
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// 모델 import
db.Bakery = require('./bakery')(sequelize, DataTypes);
db.User = require('./user')(sequelize, DataTypes);
db.Favorite = require('./favorite')(sequelize, DataTypes);

// 모델 간 연관관계 설정
db.User.belongsToMany(db.Bakery, { through: db.Favorite, foreignKey: 'userId', as: 'favorites' });
db.Bakery.belongsToMany(db.User, { through: db.Favorite, foreignKey: 'bakeryId', as: 'fans' });

module.exports = db;
