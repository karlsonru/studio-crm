import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LessonModule } from './lesson/lesson.module';
import { StudentModule } from './student/student.module';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { MongooseModule } from '@nestjs/mongoose';
import { LocationModule } from './location/location.module';
import { SubscriptionTemplateModule } from './subscription-template/subscription-template.module';
import { SubscriptionModule } from './subscription/subscription.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: 'mongodb://127.0.0.1:27017',
      }),
    }),
    UserModule,
    LessonModule,
    StudentModule,
    RoleModule,
    LocationModule,
    SubscriptionTemplateModule,
    SubscriptionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
