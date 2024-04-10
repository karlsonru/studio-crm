import * as request from 'supertest';
import * as mongoose from 'mongoose';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AttendanceModule } from './attendance.module';
import { CreateAttendanceDto, VisitedStudent } from './dto/create-attendance.dto';
import { AppModule } from '../app.module';
import {
  PaymentStatus,
  VisitStatus,
  VisitType,
  VisitedStudentWithVisitDetails,
} from '../schemas/attendance.schema';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { CreateStudentDto } from '../student/dto/create-student.dto';
import { LessonModel, StudentModel, UserModel, AttendanceModel } from '../schemas';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { CreateLessonDto, VisitingStudent } from '../lesson/dto/create-lesson.dto';

function addVisitedStudent(studentId: string, visitStatus: VisitStatus, visitType: VisitType) {
  return {
    student: studentId,
    visitStatus,
    visitType,
  };
}

interface IUpdateAttendanceDto extends Omit<UpdateAttendanceDto, 'students'> {
  students: Array<Partial<VisitedStudent>>;
}

interface ICreateAttendanceDto extends Omit<CreateAttendanceDto, 'students'> {
  students: Array<Partial<VisitedStudent>>;
}

class CreateTestModels {
  httpServer: INestApplication;
  testStudentsIds: Array<string>;
  testUsersIds: Array<string>;
  testLessonsIds: Array<string>;
  testAttendancesIds: Array<string>;

  testStudents: Array<StudentModel>;
  testUsers: Array<UserModel>;
  testLessons: Array<LessonModel>;
  testAttendances: Array<AttendanceModel>;

  token: string;

  constructor(httpServer: INestApplication) {
    this.httpServer = httpServer;
    this.testStudentsIds = [];
    this.testUsersIds = [];
    this.testLessonsIds = [];
    this.testAttendancesIds = [];
    this.token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NDhmMWViNDE0Y2RmZTAzYTAyNjY3NTQiLCJsb2dpbiI6InRhbnlhc2F2IiwiaWF0IjoxNzA4ODgwMjcwfQ.1hMY7r3-_t15ecPV0zbef31mx1YKlPjU8mlRsbRQ9Ig';
  }

  generateRandomStudent() {
    return {
      fullname: `Test ${Math.floor(Math.random() * 14)}`,
      sex: ['male', 'female'][Math.floor(Math.random() * 2)],
      birthday: 741643200000,
      contacts: [{ name: 'parent', phone: 79008007070 }],
    } as CreateStudentDto;
  }

  generateRandomUser() {
    return {
      fullname: `Test Teacher ${Math.floor(Math.random() * 100)}`,
      role: 'teacher',
      birthday: 741643200000,
      phone: 79008007070,
      canAuth: false,
    } as CreateUserDto;
  }

  generateRandomLesson(teacherId: string, students: Array<VisitingStudent>) {
    const today = new Date();
    return {
      title: `Test Lesson ${Math.floor(Math.random() * 100)}`,
      teacher: teacherId,
      students,
      location: new mongoose.Types.ObjectId()._id.toString(),
      weekday: new Date().getDay(),
      timeStart: {
        hh: today.getHours(),
        min: today.getMinutes(),
      },
      timeEnd: {
        hh: today.getHours() + 1,
        min: today.getMinutes(),
      },
      dateFrom: new Date().setDate(today.getDate() - 10),
      dateTo: new Date().setDate(today.getDate() + 10),
    } as CreateLessonDto;
  }

  async addStudent() {
    const createStudentDto = this.generateRandomStudent();
    const response = await request(this.httpServer)
      .post('/student')
      .set({ Authorization: `Bearer ${this.token}` })
      .send(createStudentDto);
    this.testStudentsIds.push(response.body._id);

    return response;
  }

  async addTeacher() {
    const createUserDto = this.generateRandomUser();
    const response = await request(this.httpServer)
      .post('/user')
      .set('Authorization', `Bearer ${this.token}`)
      .send(createUserDto);
    this.testUsersIds.push(response.body._id);

    return response;
  }

  async addLesson(teacherId: string, students: Array<VisitingStudent>) {
    const createLessonDto = this.generateRandomLesson(teacherId, students);
    const response = await request(this.httpServer)
      .post('/lesson')
      .set('Authorization', `Bearer ${this.token}`)
      .send(createLessonDto);

    this.testLessonsIds.push(response.body._id);

    return response;
  }

  async addAttendance(lessonId: string, teacherId: string, students: Array<VisitedStudent>) {
    const today = new Date();

    const createAttendanceDto = {
      lesson: lessonId,
      year: today.getFullYear(),
      month: today.getMonth() + 1,
      day: today.getDate(),
      weekday: today.getDay(),
      teacher: teacherId,
      students: students,
    } as ICreateAttendanceDto;

    const response = await request(this.httpServer)
      .post('/attendances')
      .set('Authorization', `Bearer ${this.token}`)
      .send(createAttendanceDto);

    this.testAttendancesIds.push(response.body._id);

    return response;
  }

  async deleteByIds(endpoint: string, ids: Array<string>) {
    return Promise.allSettled(
      ids.map((id) =>
        request(this.httpServer)
          .delete(`${endpoint}/${id}`)
          .set({ Authorization: `Bearer ${this.token}` }),
      ),
    );
  }

  async deleteAll() {
    await this.deleteByIds('student', this.testStudentsIds);
    await this.deleteByIds('user', this.testUsersIds);
    await this.deleteByIds('lesson', this.testLessonsIds);
    await this.deleteByIds('attendances', this.testAttendancesIds);
  }
}

describe('Attendance (e2e)', () => {
  let app: INestApplication;
  let httpServer: INestApplication;
  let testModels: CreateTestModels;

  // создаем тестовое окружение
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, AttendanceModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    httpServer = app.getHttpServer();
    testModels = new CreateTestModels(httpServer);
  });

  function validateVisitAndPaymentStatus(student: VisitedStudentWithVisitDetails) {
    // знаем, что для студента посетившего или перенесшего занятие необходимо оплатить
    if (
      student.visitStatus === VisitStatus.VISITED ||
      student.visitStatus === VisitStatus.POSTPONED_FUTURE
    ) {
      // если есть абонемент, то оплачиваем
      if (student.subscription) {
        expect(student.paymentStatus).toEqual(PaymentStatus.PAID);
      } else {
        expect(student.paymentStatus).toEqual(PaymentStatus.UNPAID);
      }
    }

    // знаем, что для студента не посетившего занятие оплаты быть не должно
    if (student.visitStatus === VisitStatus.MISSED || student.visitStatus === VisitStatus.SICK) {
      expect(student.paymentStatus).toEqual(PaymentStatus.UNCHARGED);
    }

    // для оплаченных посещений должен быть абонемент
    if (student.paymentStatus === PaymentStatus.PAID) {
      expect(student.subscription).not.toBeNull();
    }

    // для отработки посещений должно быть указано занятие вместо которого было посещение
    if (student.visitStatus === VisitStatus.POSTPONED_DONE) {
      expect(student.visitInstead).not.toBeNull();

      // с отработки не списываем оплату
      expect(student.paymentStatus === PaymentStatus.UNCHARGED);
    }
  }

  // предварительно создадим студентов:
  it('/POST create students before tests', async () => {
    // создадим студентов
    const createTestStudent1 = await testModels.addStudent();
    expect(createTestStudent1.status).toEqual(201);

    const createTestStudent2 = await testModels.addStudent();
    expect(createTestStudent2.status).toEqual(201);
  });

  // предварительно создадим учители:
  it('/POST create teacher before tests', async () => {
    const response = await testModels.addTeacher();
    expect(response.status).toEqual(201);
  });

  // предварительно создадим занятие:
  it('/POST create lesson before tests', async () => {
    // создадим занятие
    const response = await testModels.addLesson(testModels.testUsersIds[0], [
      { student: testModels.testStudentsIds[0], visitType: VisitType.REGULAR, date: null },
      { student: testModels.testStudentsIds[1], visitType: VisitType.REGULAR, date: null },
    ]);
    expect(response.status).toEqual(201);
  });

  // проверяем создание нового посещения
  it('/POST create new attendance', async () => {
    // добавим тело для запороса на создание занятия
    const lessonId = testModels.testLessonsIds[0];
    const teacherId = testModels.testUsersIds[0];

    const testStudensWithStatuses = [
      addVisitedStudent(testModels.testStudentsIds[0], VisitStatus.VISITED, VisitType.REGULAR),
      addVisitedStudent(testModels.testStudentsIds[1], VisitStatus.MISSED, VisitType.REGULAR),
    ];

    const response = await testModels.addAttendance(lessonId, teacherId, testStudensWithStatuses);

    expect(response.status).toEqual(201);
    expect(response.body.students).toBeDefined();
    expect(response.body.students).toHaveLength(testStudensWithStatuses.length);

    for (const student of response.body.students) {
      expect(student.visitStatus).toBeDefined();
      expect(student.paymentStatus).toBeDefined();
      expect(student.subscription).toBeDefined();

      validateVisitAndPaymentStatus(student);
    }
  });

  // получаем созданное посещение
  it(`/GET created attendance`, async () => {
    const attendanceId = testModels.testAttendancesIds[0];
    const response = await request(httpServer)
      .get(`/attendances/${attendanceId}`)
      .set('Authorization', `Bearer ${testModels.token}`);

    expect(response.status).toEqual(200);
    expect(response.body._id).toEqual(attendanceId);
  });

  // проверяем повторное создание уже сущесвующего посещения
  it('/POST create same attendance again ', async () => {
    // добавим тело для запороса на создание занятия
    const lessonId = testModels.testLessonsIds[0];
    const teacherId = testModels.testUsersIds[0];

    const testStudensWithStatuses = [
      addVisitedStudent(testModels.testStudentsIds[0], VisitStatus.VISITED, VisitType.REGULAR),
      addVisitedStudent(testModels.testStudentsIds[1], VisitStatus.MISSED, VisitType.REGULAR),
    ];

    const response = await testModels.addAttendance(lessonId, teacherId, testStudensWithStatuses);

    expect(response.status).toEqual(400);
  });

  // изменим статус посетившим занятие студентам
  it('/UPDATE - change visit status for 2 visited students', async () => {
    const testStudensWithStatuses = [
      // при создании VisitStatus.VISITED - PaymentStatus.UNPAID, сейчас должен измениться на UNCHARGED
      addVisitedStudent(testModels.testStudentsIds[0], VisitStatus.MISSED, VisitType.REGULAR),

      // при создании VisitStatus.MISSED - PaymentStatus.UNCHARGED, сейчас должен измениться на UNPAID
      addVisitedStudent(testModels.testStudentsIds[1], VisitStatus.VISITED, VisitType.REGULAR),
    ];

    const updateAttendanceDto: IUpdateAttendanceDto = {
      students: testStudensWithStatuses,
    };

    const attendanceId = testModels.testAttendancesIds[0];

    const response = await request(httpServer)
      .patch(`/attendances/${attendanceId}`)
      .set('Authorization', `Bearer ${testModels.token}`)
      .send(updateAttendanceDto);

    expect(response.status).toEqual(200);
    expect(response.body.students).toBeDefined();
    expect(response.body.students).toHaveLength(testStudensWithStatuses.length);
    expect(response.body._id).toEqual(attendanceId);

    for (const student of response.body.students) {
      validateVisitAndPaymentStatus(student);
    }
  });

  // изменим статус посетившим студентам ещё раз, но только одному
  it('/UPDATE created attendance - change visit status for 1 student', async () => {
    const testStudensWithStatuses = [
      // после изменения MISSED - PaymentStatus.UNCHARGED, сейчас НЕ должен измениться
      addVisitedStudent(testModels.testStudentsIds[0], VisitStatus.MISSED, VisitType.REGULAR),

      // после изменения VisitStatus.VISITED - PaymentStatus.UNPAID, сейчас должен измениться VisitStatus на SICK
      addVisitedStudent(testModels.testStudentsIds[1], VisitStatus.SICK, VisitType.REGULAR),
    ];

    const updateAttendanceDto: IUpdateAttendanceDto = {
      students: testStudensWithStatuses,
    };

    const attendanceId = testModels.testAttendancesIds[0];
    const attendanceBeforeChange = await request(httpServer)
      .get(`/attendances/${attendanceId}`)
      .set('Authorization', `Bearer ${testModels.token}`);

    const response = await request(httpServer)
      .patch(`/attendances/${attendanceId}`)
      .set('Authorization', `Bearer ${testModels.token}`)
      .send(updateAttendanceDto);

    expect(response.status).toEqual(200);
    expect(response.body.students).toBeDefined();
    expect(response.body.students).toHaveLength(testStudensWithStatuses.length);
    expect(response.body._id).toEqual(attendanceId);

    for (const student of response.body.students) {
      validateVisitAndPaymentStatus(student);
    }
  });

  // TO BE DONE
  it('/UPDATE - add new student to attendance', async () => {
    throw 'Not Implemented';
  });

  // TO BE DONE
  it('/UPDATE - remove student from attendance', async () => {
    throw 'Not Implemented';
  });

  // TO BE DONE
  it('/UPDATE - change teacher in attendance', async () => {
    throw 'Not Implemented';
  });

  it('/DELETE created attendance', async () => {
    const attendanceId = testModels.testAttendancesIds[0];
    const response = await request(httpServer)
      .delete(`/attendances/${attendanceId}`)
      .set('Authorization', `Bearer ${testModels.token}`);

    expect(response.status).toEqual(204);
  });

  // получаем удалённое посещение
  it(`/GET after delete attendance`, async () => {
    const attendanceId = testModels.testAttendancesIds[0];
    const response = await request(httpServer)
      .get(`/attendances/${attendanceId}`)
      .set('Authorization', `Bearer ${testModels.token}`);

    expect(response.status).toEqual(404);
  });

  afterAll(async () => {
    console.log('Удаляем все тестовые модели');
    await testModels.deleteAll();

    console.log('Закрываем приложение');
    await app.close();
  });
});
