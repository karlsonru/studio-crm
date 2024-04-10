import { OmitType, PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsEnum, IsMongoId, IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateAttendanceDto } from './create-attendance.dto';
import {
  PaymentStatus,
  VisitStatus,
  VisitedStudentWithVisitDetails,
} from '../../schemas/attendance.schema';
import { AttendanceType } from '../../schemas/attendance.schema';
import { logger } from '../../shared/logger.middleware';

export class UpdatedVisitedStudent extends OmitType(VisitedStudentWithVisitDetails, ['student']) {
  student: string;

  @IsOptional()
  @IsString()
  @IsMongoId()
  visitInstead?: string | null;

  @IsOptional()
  @IsNumber()
  visitInsteadDate?: number | null;
}

export class UpdateAttendanceDto extends PartialType(OmitType(CreateAttendanceDto, ['students'])) {
  @IsOptional()
  @IsEnum(AttendanceType)
  type?: AttendanceType;

  @IsOptional()
  @IsNumber()
  date?: number;

  @IsOptional()
  // @ValidateNested({ each: true })
  @Type(() => UpdatedVisitedStudentDtoAdapter)
  students?: UpdatedVisitedStudentDtoAdapter[];
}

export class UpdatedVisitedStudentDtoAdapter extends UpdatedVisitedStudent {
  constructor(visitedStudent: UpdatedVisitedStudent) {
    super();
    Object.assign(this, visitedStudent);
  }

  setPaymentStatus() {
    if (this.isVisitPayable(this.visitStatus)) {
      this.paymentStatus = this.subscription ? PaymentStatus.PAID : PaymentStatus.UNPAID;
    } else {
      this.paymentStatus = PaymentStatus.UNCHARGED;
    }

    logger.debug(`
      Студент ${this.student}. 
      Статус посещения: ${this.visitStatus}. 
      Статус оплаты: ${this.paymentStatus}. 
      Абонемент: ${this.subscription ?? 'не найден / не требуется'}.
    `);
  }

  isVisitPayable(visitStatus: VisitStatus): boolean {
    switch (visitStatus) {
      case VisitStatus.VISITED:
      case VisitStatus.POSTPONED_FUTURE:
        return true;
      default:
        return false;
    }
  }
}

export class UpdateAttendanceDtoSchemaAdapter {
  lesson?: string;
  date?: number;
  // weekday?: number;
  teacher?: string;
  type?: AttendanceType;
  students?: UpdatedVisitedStudentDtoAdapter[];

  constructor(updateAttendanceDto: UpdateAttendanceDto) {
    this.lesson = updateAttendanceDto.lesson;
    this.date = updateAttendanceDto.date;
    // this.weekday = new Date(updateAttendanceDto?.dat)?.getUTCDay();
    this.teacher = updateAttendanceDto.teacher;
    this.type = updateAttendanceDto.type;
    this.students = updateAttendanceDto.students?.map(
      (student) => new UpdatedVisitedStudentDtoAdapter(student),
    );
  }
}
