const { DataTypes } = require('sequelize');
const { sequelize } = require('../util/database');

const ActorsInMovie = sequelize.define('actorsInMovie', {
  id: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  movieId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

module.exports = { ActorsInMovie };
