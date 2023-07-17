'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    let restaurant = require('C:\\Users\\a0981\\restaurant\\public\\jsons\\restaurant.json').results
    await queryInterface.bulkInsert('restaurants', restaurant)
  },

  async down (queryInterface, Sequelize) {

    await queryInterface.bulkDelete('restaurant', null)
  }
};
