import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { router } from './routes';
import { db } from './config/db';
import { loggerApp } from './config/logger';

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors({
  origin: '*',
}));

app.use(express.json());
app.use('/api', router);

await db();

app.listen(port, () => {
  console.log(`Running on port ${port}`);
  loggerApp.debug(`Running on port ${port}`);
});
