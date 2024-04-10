import { logger } from '../shared/logger.middleware';
import {
  PaymentStatus,
  VisitStatus,
  AttendanceType,
  VisitType,
} from '../schemas/attendance.schema';
import { CreateAttendanceDto, VisitedStudent } from './dto/create-attendance.dto';

export class VisitedStudentWithVisitDetails extends VisitedStudent {
  paymentStatus: PaymentStatus;
  subscription: string | null;

  constructor(student: VisitedStudent) {
    super();
    Object.assign(this, student);

    this.paymentStatus = PaymentStatus.UNKNOWN;
    this.subscription = null;
  }

  setSubscription(subscription: string) {
    this.subscription = subscription;
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

  isOneTimeVisit(): boolean {
    return this.visitType !== VisitType.REGULAR;
  }
}

export class CreateAttendanceDtoSchemaAdapter {
  lesson: string;
  date: number;
  weekday: number;
  teacher: string;
  type: AttendanceType;
  students: VisitedStudentWithVisitDetails[];

  constructor(createAttendanceDto: CreateAttendanceDto) {
    this.lesson = createAttendanceDto.lesson;
    this.teacher = createAttendanceDto.teacher;

    this.date = Date.UTC(
      createAttendanceDto.year,
      createAttendanceDto.month - 1,
      createAttendanceDto.day,
    );
    this.weekday = new Date(this.date).getUTCDay();

    // Это занятие из будущего ?
    this.type = this.date > Date.now() ? AttendanceType.FUTURE : AttendanceType.DONE;

    this.students = createAttendanceDto.students.map(
      (student) => new VisitedStudentWithVisitDetails(student),
    );
  }
}
