import * as request from 'supertest';
import * as mongoose from 'mongoose';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AttendanceModule } from './attendance.module';
import { CreateAttendanceDto, VisitedStudent } from './dto/create-attendance.dto';
import { AppModule } from '../app.module';
import { PaymentStatus, VisitStatus, VisitType } from '../schemas/attendance.schema';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { CreateStudentDto } from '../student/dto/create-student.dto';
import { StudentModel } from '../schemas';

async function addStudent(httpServer: INestApplication, createStudentDto: CreateStudentDto) {
  return await request(httpServer).post('/student').send(createStudentDto);
}

function addVisitedStudent(studentId: string, visitStatus: VisitStatus, visitType: VisitType) {
  return {
    student: studentId,
    visitStatus,
    visitType,
  };
}

interface ICreateAttendanceDto extends Omit<CreateAttendanceDto, 'students'> {
  students: Array<Partial<VisitedStudent>>;
}

function addAttendanceDto(students: Array<Partial<VisitedStudent>>): ICreateAttendanceDto {
  return {
    lesson: '6490cc37762f1da820b60761',
    year: 2023,
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
    weekday: new Date().getDay(),
    teacher: new mongoose.Types.ObjectId().toString(),
    students,
  };
}

interface IUpdateAttendanceDto extends Omit<UpdateAttendanceDto, 'students'> {
  students: Array<Partial<VisitedStudent>>;
}

describe('Attendance (e2e)', () => {
  let app: INestApplication;
  let httpServer: INestApplication;
  let attendanceId: string;
  let student1: StudentModel;
  let student2: StudentModel;

  // создаем тестовое окружение
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, AttendanceModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    httpServer = app.getHttpServer();
  });

  // предварительно создадим студентов:
  it('/POST create students before tests', async () => {
    // создадим студентов
    const response1 = await addStudent(httpServer, {
      fullname: 'Test1',
      sex: 'male',
      birthday: 741643200000,
      contacts: [{ name: 'parent', phone: 79008007070 }],
    });

    expect(response1.status).toEqual(201);
    student1 = response1.body;

    // создадим студентов
    const response2 = await addStudent(httpServer, {
      fullname: 'Test2',
      sex: 'male',
      birthday: 741643200000,
      contacts: [{ name: 'parent', phone: 79008007070 }],
    });

    expect(response2.status).toEqual(201);
    student2 = response2.body;
  });

  // проверяем создание нового посещения
  it('/POST create new attendance', async () => {
    // добавим тело для запороса на создание занятия
    const createAttendanceDto = addAttendanceDto([
      addVisitedStudent(student1._id.toString(), VisitStatus.VISITED, VisitType.REGULAR),
      addVisitedStudent(student2._id.toString(), VisitStatus.MISSED, VisitType.REGULAR),
    ]);

    const response = await request(httpServer).post('/attendances').send(createAttendanceDto);

    expect(response.headers['content-type']).toMatch(/application\/json/);
    expect(response.status).toEqual(201);
    expect(response.body.students).toBeDefined();
    expect(response.body.students).toHaveLength(2);

    // проверяем что у 1 и 2 студента выставлены корректные Visit & Billing статусы
    expect(response.body.students[0].visitStatus).toEqual(VisitStatus.VISITED);
    expect(response.body.students[0].paymentStatus).toEqual(PaymentStatus.UNPAID);

    expect(response.body.students[1].visitStatus).toEqual(VisitStatus.MISSED);
    expect(response.body.students[1].paymentStatus).toEqual(PaymentStatus.UNCHARGED);

    attendanceId = response.body._id;
  });

  // получаем созданное посещение
  it(`/GET created attendance`, async () => {
    const response = await request(httpServer).get(`/attendances/${attendanceId}`);

    expect(response.status).toEqual(200);
    expect(response.body._id).toEqual(attendanceId);
  });

  // изменим статус посетившим занятие студентам
  it('/UPDATE created attendance - change visit status for 2 visited students', async () => {
    const updateAttendanceDto: IUpdateAttendanceDto = {
      students: [
        // при создании VisitStatus.VISITED - PaymentStatus.UNPAID, сейчас должен измениться на UNCHARGED
        addVisitedStudent(student1._id.toString(), VisitStatus.MISSED, VisitType.REGULAR),
        // при создании VisitStatus.MISSED - PaymentStatus.UNCHARGED, сейчас должен измениться на UNPAID
        addVisitedStudent(student2._id.toString(), VisitStatus.VISITED, VisitType.REGULAR),
      ],
    };

    const response = await request(httpServer)
      .patch(`/attendances/${attendanceId}`)
      .send(updateAttendanceDto);

    expect(response.status).toEqual(200);
    expect(response.body.students).toBeDefined();
    expect(response.body.students).toHaveLength(2);
    expect(response.body._id).toEqual(attendanceId);

    // проверяем изменение VisitStatus у 1 студента с VISITED на MISSED
    expect(response.body.students[0].visitStatus).toEqual(VisitStatus.MISSED);
    // проверяем изменение PaymentStatus у 1 студента с UNPAID на UNCHARGED
    expect(response.body.students[0].paymentStatus).toEqual(PaymentStatus.UNCHARGED);

    // проверяем изменение VisitStatus у 2 студента с MISSED на VISITED
    expect(response.body.students[1].visitStatus).toEqual(VisitStatus.VISITED);
    // проверяем изменение PaymentStatus у 2 студента с UNCHARGED на UNPAID
    expect(response.body.students[1].paymentStatus).toEqual(PaymentStatus.UNPAID);
  });

  // изменим статус посетившим студентам ещё раз, но только одному
  it('/UPDATE created attendance - change visit status for 1 visited student', async () => {
    const updateAttendanceDto: IUpdateAttendanceDto = {
      students: [
        // после изменения MISSED - PaymentStatus.UNCHARGED, сейчас НЕ должен измениться
        addVisitedStudent(student1._id.toString(), VisitStatus.MISSED, VisitType.REGULAR),
        // после изменения VisitStatus.VISITED - PaymentStatus.UNPAID, сейчас должен измениться VisitStatus на SICK
        addVisitedStudent(student2._id.toString(), VisitStatus.SICK, VisitType.REGULAR),
      ],
    };

    const response = await request(httpServer)
      .patch(`/attendances/${attendanceId}`)
      .send(updateAttendanceDto);

    expect(response.status).toEqual(200);
    expect(response.body.students).toBeDefined();
    expect(response.body.students).toHaveLength(2);
    expect(response.body._id).toEqual(attendanceId);

    // проверяем что VisitStatus у 1 студента не изменился с MISSED
    expect(response.body.students[0].visitStatus).toEqual(VisitStatus.MISSED);
    // проверяем что PaymentStatus у 1 студента не изменился с UNCHARGED
    expect(response.body.students[0].paymentStatus).toEqual(PaymentStatus.UNCHARGED);

    // проверяем изменение VisitStatus у 2 студента с VISITED на SICK
    expect(response.body.students[1].visitStatus).toEqual(VisitStatus.SICK);
    // проверяем изменение PaymentStatus у 2 студента с UNPAID на UNCHARGED
    expect(response.body.students[0].paymentStatus).toEqual(PaymentStatus.UNCHARGED);
  });

  it('/DELETE created attendance', async () => {
    const response = await request(httpServer).delete(`/attendances/${attendanceId}`);

    expect(response.status).toEqual(204);
  });

  it(`/GET deleted attendance`, async () => {
    const response = await request(httpServer).get(`/attendances/${attendanceId}`);

    expect(response.status).toEqual(404);
  });

  // удаляем созданные студентов для теста
  it('/DELETE created student1', async () => {
    const response = await request(httpServer).delete(`/student/${student1._id.toString()}`);
    expect(response.status).toEqual(204);
  });

  it('/DELETE created student2', async () => {
    const response = await request(httpServer).delete(`/student/${student2._id.toString()}`);
    expect(response.status).toEqual(204);
  });

  afterAll(async () => {
    await app.close();
  });
});
