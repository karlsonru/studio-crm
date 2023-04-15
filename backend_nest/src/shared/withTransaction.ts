import { Model, Document, ClientSession } from 'mongoose';

export async function withTransaction<T extends Document>(
  model: Model<T>,
  transactionOps: (session: ClientSession) => Promise<T>,
): Promise<T> {
  const session = await model.startSession();

  try {
    let result: T;
    await session.withTransaction(async () => {
      result = await transactionOps(session);
    });
    return result!;
  } catch (error) {
    console.error('Transaction aborted:', error);
    throw error;
  } finally {
    session.endSession();
  }
}
