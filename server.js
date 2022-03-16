const { app } = require('./app');

const PORT = process.env.PORT || 4000;

const { sequelize } = require('./util/database');
const { initModels } = require('./util/initModels');

sequelize
  .authenticate()
  .then(() => console.log('Database authenticated'))
  .catch((err) => console.log(err));

// Models relations
initModels();

sequelize
  .sync()
  .then(() => console.log('Database synced'))
  .catch((err) => console.log(err));

app.listen(PORT, () => {
  console.log(`Express app running on port: ${PORT}`);
});
