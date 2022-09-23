import express from 'express';
import dotenv from 'dotenv';
import log4js from 'log4js';
import { router } from './routes';
import { db } from './db';

dotenv.config();

const logger = log4js.getLogger();
logger.level = process.env.LOG_LEVEL ?? 'warning';

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use('/', router);

await db()

app.listen(port, () => console.log(`Running on port ${port}`));
