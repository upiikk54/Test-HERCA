'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Penjualan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Penjualan.belongsTo(models.Marketing, {
        foreignKey: 'marketing_id'
      })
    }
  }
  Penjualan.init({
    transaction_number: DataTypes.STRING,
    marketing_id: DataTypes.INTEGER,
    date: DataTypes.DATE,
    cargo_fee: DataTypes.INTEGER,
    total_balance: DataTypes.INTEGER,
    grand_total: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Penjualan',
  });
  return Penjualan;
};