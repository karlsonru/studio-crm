import { Module } from '@nestjs/common';
import { VisitStatusService } from './visit-status.service';
import { VisitStatusController } from './visit-status.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { VisitStatusModel, VisitStatusSchema } from '../schemas';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: VisitStatusModel.name, schema: VisitStatusSchema }]),
  ],
  controllers: [VisitStatusController],
  providers: [VisitStatusService],
})
export class VisitStatusModule {}
