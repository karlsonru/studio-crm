import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentModel, StudentDocument } from '../schemas/student.schema';
import { StudentEntity } from './entities/student.entity';

@Injectable()
export class StudentService {
  constructor(
    @InjectModel(StudentModel.name)
    private readonly studentModel: Model<StudentDocument>,
  ) {}

  async create(createStudentDto: CreateStudentDto): Promise<StudentEntity | null> {
    const isExists = await this.studentModel.findOne({
      fullname: createStudentDto.fullname.trim(),
    });

    if (isExists) {
      return null;
    }

    const created = await this.studentModel.create(createStudentDto);

    return created;
  }

  async findAll(): Promise<Array<StudentEntity>> {
    return await this.studentModel.find({});
  }

  async findOne(id: string): Promise<StudentEntity | null> {
    return await this.studentModel.findById(id);
  }

  async update(id: string, updateStudentDto: UpdateStudentDto): Promise<StudentEntity | null> {
    const updated = await this.studentModel.findByIdAndUpdate(id, updateStudentDto, {
      new: true,
    });
    return updated;
  }

  async remove(id: string) {
    await this.studentModel.findByIdAndRemove(id);
    return;
  }
}
