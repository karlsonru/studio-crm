import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { LocationModel, LocationSchema } from '../schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: LocationModel.name,
        schema: LocationSchema,
      },
    ]),
  ],
  controllers: [LocationController],
  providers: [LocationService],
})
export class LocationModule {}
