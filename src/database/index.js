const Sequelize = require('sequelize');
const databaseConfig = require('../config/database');
const User = require('../app/models/User');
const Recipient = require('../app/models/Recipient');
const models = [User, Recipient];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models.map(model => model.init(this.connection));
  }
}

module.exports = new Database();
