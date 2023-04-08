import { Module } from '@nestjs/common';
import { VisitStatusService } from './visit-status.service';
import { VisitStatusController } from './visit-status.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { VisitStatus, VisitStatusSchema } from '../schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: VisitStatus.name, schema: VisitStatusSchema },
    ]),
  ],
  controllers: [VisitStatusController],
  providers: [VisitStatusService],
})
export class VisitStatusModule {}
