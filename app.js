const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

const { actorsRouter } = require('./routes/actors.routes');
const { moviesRouter } = require('./routes/movies.routes');
const { userRouter } = require('./routes/users.routes');

const { globalErrorHandler } = require('./controllers/error.controller');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 1000,
    message: 'Too many requests from your IP, try after 1 hour'
  })
);

app.use(helmet());

app.use(compression());

app.use(morgan('dev'));

app.use('/api/v1/actors', actorsRouter);
app.use('/api/v1/movies', moviesRouter);
app.use('/api/v1/users', userRouter);

app.use(globalErrorHandler);

module.exports = { app };
