import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { StudentModel, StudentSchema } from '../schemas/student.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: StudentModel.name, schema: StudentSchema }])],
  controllers: [StudentController],
  providers: [StudentService],
})
export class StudentModule {}
