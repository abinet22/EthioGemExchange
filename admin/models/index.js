const dbConfig = require("../config/dbconfig.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: 0,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./User.js")(sequelize, Sequelize);
db.dealers = require("./Dealer.js")(sequelize, Sequelize);
db.gemsubcategories = require("./GemSubCategory.js")(sequelize, Sequelize);
db.gemcategories = require("./GemCategory.js")(sequelize, Sequelize);
db.dealercompanyinfos = require("./DealerCompanyInfo.js")(sequelize, Sequelize);
db.products = require("./Product.js")(sequelize, Sequelize);

module.exports = db;