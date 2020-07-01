'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'files',
      [
        {
          name: 'avatar.png',
          path: 'd5a88d3c30f529e3bb3ef6241d1564fb.png',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {},
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('files', null, {});
  },
};
