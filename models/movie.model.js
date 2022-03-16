const { DataTypes } = require('sequelize');
const { sequelize } = require('../util/database');

const Movie = sequelize.define('movie', {
  id: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  description: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  duration: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  imgUrl: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  genre: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  status: {
    type: DataTypes.STRING(10),
    defaultValue: 'active',
    allowNull: false
  }
});

module.exports = { Movie };
