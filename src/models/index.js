import Sequelize from "sequelize";
import dotenv from "dotenv";

dotenv.config();

let sequelize;

if (process.env.DB_URL) {
  sequelize = new Sequelize(process.env.URL, {
    dialect: process.env.DB_DIALECT,
    operatorsAliases: false,
  });
} else {
  sequelize = new Sequelize(
    process.env.DB_DATABASE,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      dialect: process.env.DB_DIALECT,
      operatorsAliases: false,
    }
  );
}

const models = {
  User: sequelize.import("./user"),
  Donate: sequelize.import("./donate"),
};

Object.keys(models).forEach((key) => {
  if ("associate" in models[key]) {
    models[key].associate(models);
  }
});

export { sequelize };
export default models;
