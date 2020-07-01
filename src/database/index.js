const Sequelize = require('sequelize');
const databaseConfig = require('../config/database');
const User = require('../app/models/User');
const Recipient = require('../app/models/Recipient');
const File = require('../app/models/File');
const Delivery = require('../app/models/Delivery');
const DeliveryProblem = require('../app/models/DeliveryProblem');

const models = [User, Recipient, File, Delivery, DeliveryProblem];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

module.exports = new Database();
