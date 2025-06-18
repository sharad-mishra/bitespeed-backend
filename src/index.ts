import express from 'express';
import { json } from 'body-parser';
import identifyRouter from './routes/identify';
import sequelize from './utils/db';

const app = express();
app.use(json());
app.use('/identify', identifyRouter);

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established');
    await sequelize.sync();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

startServer();