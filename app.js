const express = require('express');

const { actorsRouter } = require('./routes/actors.routes');
const { moviesRouter } = require('./routes/movies.routes');
const { userRouter } = require('./routes/users.routes');

const { globalErrorHandler } = require('./controllers/error.controller');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/actors', actorsRouter);
app.use('/api/v1/movies', moviesRouter);
app.use('/api/v1/users', userRouter);

app.use(globalErrorHandler);

module.exports = { app };
