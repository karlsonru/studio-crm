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
    if (!isValidObjectId(value)) {
      throw new HttpException({ message: 'Invalid ID parameter' }, HttpStatus.BAD_REQUEST);
    }
    return value;
  }
}

@Injectable()
export class ValidateNumberPipe implements PipeTransform<string> {
  transform(value: string, metadata: ArgumentMetadata): number {
    if (isNaN(+value)) {
      console.log(value);
      throw new HttpException({ message: 'Invalid number parameter' }, HttpStatus.BAD_REQUEST);
    }
    return +value;
  }
}
