'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Marketing extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Marketing.hasMany(models.Penjualan, {
        foreignKey: 'marketing_id'
      })
    }
  }
  Marketing.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Marketing',
  });
  return Marketing;
};