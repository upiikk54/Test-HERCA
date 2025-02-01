'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Pembayaran extends Model {
    static associate(models) {
      Pembayaran.belongsTo(models.Penjualan, {
        foreignKey: 'penjualan_id'
      });
    }
  }
  
  Pembayaran.init({
    penjualan_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    payment_number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    payment_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    payment_amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false
    },
    payment_method: {
      type: DataTypes.ENUM('cash', 'transfer', 'debit', 'credit'),
      allowNull: false
    },
    payment_status: {
      type: DataTypes.ENUM('pending', 'completed', 'failed'),
      defaultValue: 'pending'
    },
    remaining_balance: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false
    },
    notes: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Pembayaran',
  });
  
  return Pembayaran;
}; 