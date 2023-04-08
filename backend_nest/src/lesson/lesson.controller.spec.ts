import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { LessonController } from './lesson.controller';
import { LessonService } from './lesson.service';
import { getModelToken } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { HttpException, HttpStatus, INestApplication } from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UserEntity } from '../user/entities/user.entity';
import { StudentEntity } from '../student/entities/student.entity';
import { LocationEntity } from '../location/entities/location.entity';
// import { LessonModule } from './lesson.module';

describe('LessonController', () => {
  let app: INestApplication;
  let controller: LessonController;
  let service: LessonService;

  const createDto: CreateLessonDto = {
    title: 'Test Lesson',
    teacher: new Types.ObjectId().toString(),
    students: [
      new Types.ObjectId().toString(),
      new Types.ObjectId().toString(),
    ],
    location: new Types.ObjectId().toString(),
    day: 1,
    timeStart: 1215,
    timeEnd: 1300,
    dateFrom: 112342,
    dateTo: 112345454,
    isActive: true,
  };

  const mockEntity = {
    _id: new Types.ObjectId(),
    title: 'Test Lesson',
    teacher: new UserEntity(),
    students: [new StudentEntity(), new StudentEntity()],
    location: new LocationEntity(),
    day: 1,
    timeStart: 1215,
    timeEnd: 1300,
    dateFrom: 112342,
    dateTo: 112345454,
    isActive: true,
  };

  const updatedMockEntity = {
    title: 'Updated lesson',
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LessonController],
      providers: [
        LessonService,
        {
          provide: getModelToken('Lesson'),
          useValue: {},
        },
      ],
    }).compile();

    /*
    beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LessonController],
      providers: [
        LessonService,
        {
          provide: getModelToken('Lesson'),
          useValue: {},
        },
      ],
    }).compile();
    */
    controller = module.get<LessonController>(LessonController);
    service = module.get<LessonService>(LessonService);
    app = module.createNestApplication();
    await app.init();
  });

  describe('getLessons', () => {
    it('should return an array of lessons', async () => {
      return request(app.getHttpServer())
        .get('/lesson')
        .expect(400)
        .expect({
          paylod: [mockEntity],
        });

      /*  
      jest.spyOn(service, 'findAll').mockResolvedValueOnce([mockEntity]);

      expect((await controller.findAll()).payload).toContainEqual(mockEntity);
      */
    });
  });

  describe('getLesson', () => {
    it('should return a lesson with the given id', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(mockEntity);

      expect(
        (await controller.findOne(mockEntity._id.toString())).payload,
      ).toEqual(mockEntity);
    });

    it('should raise HttpException with NOT FOUND HttpStatus if no lesson is found with the given id', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(null);

      try {
        await controller.findOne(new Types.ObjectId().toString());
      } catch (err) {
        expect(err).toEqual(
          new HttpException({ message: 'Не найдено' }, HttpStatus.NOT_FOUND),
        );
      }
    });
  });

  describe('createLesson', () => {
    it('should create a new lesson and return it', async () => {
      jest.spyOn(service, 'create').mockResolvedValueOnce(mockEntity);

      const create = await controller.create(createDto);
      expect(create.payload).toEqual(mockEntity);
    });
  });

  describe('updateLesson', () => {
    it('should update an existing lesson and return it', async () => {
      const updatedLesson = Object.assign({}, mockEntity);
      updatedLesson.title = updatedMockEntity.title;

      jest.spyOn(service, 'update').mockResolvedValueOnce(updatedLesson);

      expect(
        (await controller.update(mockEntity._id.toString(), updatedMockEntity))
          .payload,
      ).toEqual(updatedLesson);
    });

    it('should return a 404 error if no lesson is found with the given id', async () => {
      jest.spyOn(service, 'update').mockResolvedValueOnce(null);

      try {
        await controller.update(
          new Types.ObjectId().toString(),
          updatedMockEntity,
        );
      } catch (err) {
        expect(err).toEqual(
          new HttpException({ message: 'Не найдено' }, HttpStatus.NOT_FOUND),
        );
      }
    });
  });

  describe('deleteLesson', () => {
    it('should delete an existing lesson and return it', async () => {
      jest.spyOn(service, 'remove').mockResolvedValueOnce(undefined);

      expect(await controller.remove(mockEntity._id.toString())).toEqual(
        undefined,
      );
    });

    it('should return a 404 error if no lesson is found with the given id', async () => {
      jest.spyOn(service, 'remove').mockResolvedValueOnce();

      expect(await controller.remove(new Types.ObjectId().toString())).toEqual(
        undefined,
      );
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
