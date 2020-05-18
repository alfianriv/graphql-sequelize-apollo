import Sequelize from 'sequelize';
import dotenv from 'dotenv'

const config = dotenv.config().parsed

let sequelize;

sequelize = new Sequelize(
  config.DB_DATABASE,
  config.DB_USERNAME,
  config.DB_PASSWORD, {
    host: config.DB_HOST,
    dialect: config.DB_DIALECT,
  },
);

const models = {
  User: sequelize.import('./user'),
  Donate: sequelize.import('./donate'),
};

Object.keys(models).forEach(key => {
  if ('associate' in models[key]) {
    models[key].associate(models);
  }
});

export {
  sequelize
};
export default models;