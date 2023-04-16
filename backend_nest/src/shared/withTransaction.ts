import { Model, Document, ClientSession } from 'mongoose';
import { logger } from './logger.middleware';

export async function withTransaction<T extends Document>(
  model: Model<T>,
  transactionOps: (session: ClientSession) => Promise<T>,
): Promise<T | null> {
  const session = await model.startSession();
  logger.info(`Начинаем выполнять транзакцию`);

  try {
    let result: T;
    await session.withTransaction(async () => {
      result = await transactionOps(session);
    });
    logger.info(`Транзакция завершена`);
    return result!;
  } catch (error) {
    console.error('Transaction aborted:', error);
    logger.error(`Транзакция прервана ${error.stack}`);
    throw error;
  } finally {
    session.endSession();
  }
}
