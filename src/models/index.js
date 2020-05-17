import Sequelize from 'sequelize';

const config = require('../../config/config.json')[process.env.NODE_ENV]


let sequelize;
if (config.db.database_url) {
  sequelize = new Sequelize(config.db.database_url, {
    dialect: config.db.dialect,
  });
} else {
  sequelize = new Sequelize(
    config.db.database,
    config.db.username,
    config.db.password, 
    {
      host: config.db.host,
      dialect: config.db.dialect,
    },
  );
}

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