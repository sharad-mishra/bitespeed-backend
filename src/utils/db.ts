import { Sequelize, Options } from 'sequelize';
import config from '../config/config.json';

// Define the structure of config.json
interface DatabaseConfig {
  username?: string;
  password?: string;
  database?: string;
  host?: string;
  dialect: 'mysql' | 'postgres';
  use_env_variable?: string;
  dialectOptions?: {
    ssl?: {
      require: boolean;
      rejectUnauthorized: boolean;
    };
  };
}

interface Config {
  development: DatabaseConfig;
  test: DatabaseConfig;
  production: DatabaseConfig;
}

const typedConfig: Config = config as any;

const env = (process.env.NODE_ENV || 'development') as keyof Config;
const dbConfig = typedConfig[env];

let sequelize: Sequelize;

if (dbConfig.use_env_variable) {
  sequelize = new Sequelize(process.env[dbConfig.use_env_variable]!, {
    ...dbConfig,
    logging: false,
  } as Options);
} else {
  sequelize = new Sequelize(
    dbConfig.database!,
    dbConfig.username!,
    dbConfig.password!,
    {
      ...dbConfig,
      logging: false,
    } as Options
  );
}

export default sequelize;