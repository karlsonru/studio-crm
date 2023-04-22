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
import { VisitStatusModule } from './visit-status/visit-status.module';
import { VisitedLessonModule } from './visited-lesson/visited-lesson.module';
import { BillingService } from './billing/billing.service';

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
    VisitStatusModule,
    VisitedLessonModule,
  ],
  controllers: [AppController],
  providers: [AppService, BillingService],
})
export class AppModule {}
