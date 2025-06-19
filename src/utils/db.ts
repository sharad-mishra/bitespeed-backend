import { Sequelize } from 'sequelize';
import config from '../config/config.json';

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.use_env_variable ? process.env[dbConfig.use_env_variable]! : dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    ...dbConfig,
    logging: false,
  }
);

export default sequelize;