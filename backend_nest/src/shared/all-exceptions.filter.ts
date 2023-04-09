import { Catch, ArgumentsHost, HttpException, ExceptionFilter } from '@nestjs/common';
import { MongoServerError } from 'mongodb';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(error: Error, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();

    switch (true) {
      case error.name.includes('ValidationError'):
        console.error(error);
        response.status(400).json({
          message: error.message || 'Переданы некорректные данные при запросе',
        });
        break;

      case error instanceof MongoServerError:
        console.error(error);
        response.status(500).json({ message: 'Ошибка записи в базу данных' });
        break;

      case error instanceof HttpException:
        console.error(error);
        response.status((error as HttpException).getStatus()).json({ message: error.message });
        break;

      default:
        console.error(error);
        response.status(500).json({ message: error.message });
    }
  }
}
