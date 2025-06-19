import { Sequelize, DataTypes } from 'sequelize';
import fs from 'fs';
import path from 'path';
import configJson from '../config/config.json';

const config: { [key: string]: any } = configJson; // Add this line

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const db: any = {};

const sequelize = dbConfig.use_env_variable
  ? new Sequelize(process.env[dbConfig.use_env_variable]!, dbConfig)
  : new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig);

(async () => {
  const files = fs
    .readdirSync(__dirname)
    .filter((file) => {
      return (
        file.indexOf('.') !== 0 &&
        file !== basename &&
        file.slice(-3) === '.ts' &&
        file.indexOf('.test.ts') === -1
      );
    });

  for (const file of files) {
    const modelModule = await import(path.join(__dirname, file));
    const model = modelModule.default(sequelize, DataTypes);
    db[model.name] = model;
  }

  Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });
})();

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;