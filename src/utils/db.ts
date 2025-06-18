import { Sequelize } from 'sequelize';
import config from '../config/config.json';

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database || process.env[dbConfig.use_env_variable],
  dbConfig.username,
  dbConfig.password,
  {
    ...dbConfig,
    logging: false,
  }
);

export default sequelize;