import {
  Injectable,
  PipeTransform,
  ArgumentMetadata,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class ValidateIdPipe implements PipeTransform<string> {
  transform(value: string, metadata: ArgumentMetadata): string {
    console.log(`validation id: ${value} Is valid?: ${isValidObjectId(value)}`);
    if (!isValidObjectId(value)) {
      throw new HttpException({ message: 'Invalid ID parameter' }, HttpStatus.BAD_REQUEST);
    }
    return value;
  }
}
