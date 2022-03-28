const { Actor } = require('./actor.model');
const { Movie } = require('./movie.model');

const { DataTypes } = require('sequelize');
const { sequelize } = require('../util/database');

const ActorInMovie = sequelize.define('actorsInMovie', {
  id: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false
  },
  actorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Actor,
      key: 'id'
    }
  },
  movieId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Movie,
      key: 'id'
    }
  }
});

module.exports = { ActorInMovie };
