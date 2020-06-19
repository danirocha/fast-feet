const { Model, Sequelize } = require('sequelize');

class Recipient extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        street: Sequelize.STRING,
        number: Sequelize.INTEGER,
        complement: Sequelize.STRING,
        city: Sequelize.STRING,
        state: Sequelize.STRING,
        zip_code: Sequelize.INTEGER,
      },
      {
        sequelize,
      },
    );

    return this;
  }
}

module.exports = Recipient;
