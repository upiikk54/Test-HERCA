'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Penjualans', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      transaction_number: {
        type: Sequelize.STRING
      },
      marketing_id: {
        type: Sequelize.INTEGER,
        reference: {
          model: 'Marketings',
          key: 'id'
        }
      },
      date: {
        type: Sequelize.DATE
      },
      cargo_fee: {
        type: Sequelize.INTEGER
      },
      total_balance: {
        type: Sequelize.INTEGER
      },
      grand_total: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Penjualans');
  }
};