import * as request from 'supertest';
import * as mongoose from 'mongoose';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AttendanceModule } from './attendance.module';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { AppModule } from '../app.module';

const createAttendanceDto: CreateAttendanceDto = {
  lesson: new mongoose.Types.ObjectId().toString(),
  year: 2023,
  month: new Date().getMonth() + 1,
  day: new Date().getDate(),
  weekday: new Date().getDay(),
  teacher: new mongoose.Types.ObjectId().toString(),
  students: [],
};

describe('attendance', () => {
  let app: INestApplication;
  let httpServer: INestApplication;
  let attendanceId: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, AttendanceModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    httpServer = app.getHttpServer();
  });

  it('/POST create new attendance', async () => {
    const response = await request(httpServer).post('/attendances').send(createAttendanceDto);

    expect(response.headers['content-type']).toMatch(/application\/json/);
    expect(response.status).toEqual(201);

    attendanceId = response.body._id;
  });

  it(`/GET created attendance`, async () => {
    const response = await request(httpServer).get(`/attendances/${attendanceId}`);

    expect(response.status).toEqual(200);
    expect(response.body._id).toEqual(attendanceId);
  });

  it('/DELETE created attendance', async () => {
    const response = await request(httpServer).delete(`/attendances/${attendanceId}`);

    expect(response.status).toEqual(204);
  });

  it(`/GET deleted attendance`, async () => {
    const response = await request(httpServer).get(`/attendances/${attendanceId}`);

    expect(response.status).toEqual(404);
  });

  afterAll(async () => {
    await app.close();
  });
});
