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
export class ValidateOptionalNumberPipe implements PipeTransform<string> {
  transform(value: string, metadata: ArgumentMetadata): number {
    // wtf - непонятно для чего я это сделал
    /*
    if (value === undefined) {
      return 0;
    }
    */

    const candidate = parseInt(value, 10);
    if (isNaN(candidate)) {
      throw new HttpException({ message: 'Invalid number parameter' }, HttpStatus.BAD_REQUEST);
    }

    return Number(candidate);
  }
}
