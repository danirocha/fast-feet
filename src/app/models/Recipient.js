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
        address: {
          type: Sequelize.VIRTUAL,
          get() {
            return {
              street: this.street,
              number: this.number,
              complement: this.complement,
              city: this.city,
              state: this.state,
              zip_code: this.zip_code,
            };
          },
        },
      },
      {
        sequelize,
      },
    );

    return this;
  }
}

module.exports = Recipient;
