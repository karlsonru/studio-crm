import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentModel, StudentDocument } from '../schemas';
import { IFilterQuery } from 'src/shared/IFilterQuery';

@Injectable()
export class StudentService {
  constructor(
    @InjectModel(StudentModel.name)
    private readonly studentModel: Model<StudentDocument>,
  ) {}

  async create(createStudentDto: CreateStudentDto): Promise<StudentModel | null> {
    const isExists = await this.studentModel.findOne({
      fullname: createStudentDto.fullname.trim(),
    });

    if (isExists) {
      return null;
    }

    const created = await this.studentModel.create(createStudentDto);

    return created;
  }

  async findAll(query: IFilterQuery<StudentModel>): Promise<Array<StudentModel>> {
    return await this.studentModel.find(query);
  }

  async findOne(id: string): Promise<StudentModel | null> {
    return await this.studentModel.findById(id);
  }

  async update(id: string, updateStudentDto: UpdateStudentDto): Promise<StudentModel | null> {
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
