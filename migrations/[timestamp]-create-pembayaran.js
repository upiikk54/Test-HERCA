'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Pembayarans', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      penjualan_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Penjualans',
          key: 'id'
        },
        allowNull: false
      },
      payment_number: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      payment_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      payment_amount: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false
      },
      payment_method: {
        type: Sequelize.ENUM('cash', 'transfer', 'debit', 'credit'),
        allowNull: false
      },
      payment_status: {
        type: Sequelize.ENUM('pending', 'completed', 'failed'),
        defaultValue: 'pending'
      },
      remaining_balance: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false
      },
      notes: {
        type: Sequelize.TEXT
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
    await queryInterface.dropTable('Pembayarans');
  }
}; 