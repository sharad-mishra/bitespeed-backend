import { Sequelize } from 'sequelize';
import config from '../config/config.json';

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

let sequelize: Sequelize;

if (env === 'production' && dbConfig.use_env_variable) {
  sequelize = new Sequelize(process.env[dbConfig.use_env_variable]!, {
    dialect: 'mysql',
    logging: false,
  });
} else {
  sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    {
      ...dbConfig,
      logging: false,
    }
  );
}

export default sequelize;