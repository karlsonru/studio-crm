import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LessonModule } from './lesson/lesson.module';
import { StudentModule } from './student/student.module';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { LocationModule } from './location/location.module';
import { SubscriptionTemplateModule } from './subscription-template/subscription-template.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { VisitedLessonModule } from './visited-lesson/visited-lesson.module';
import { BillingService } from './billing/billing.service';
import { StatisticModule } from './statistic/statistic.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: 'mongodb://127.0.0.1:27017',
      }),
    }),
    UserModule,
    LessonModule,
    VisitedLessonModule,
    StudentModule,
    LocationModule,
    SubscriptionTemplateModule,
    SubscriptionModule,
    StatisticModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, BillingService],
})
export class AppModule {}
