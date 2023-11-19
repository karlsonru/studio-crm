import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LessonModule } from './lesson/lesson.module';
import { StudentModule } from './student/student.module';
import { UserModule } from './user/user.module';
import { LocationModule } from './location/location.module';
import { AttendanceModule } from './attendance/attendance.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { SubscriptionTemplateModule } from './subscription-template/subscription-template.module';
import { StatisticModule } from './statistic/statistic.module';
import { AuthModule } from './auth/auth.module';
import { FinanceModule } from './finance/finance.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: 'mongodb://127.0.0.1:27017',
      }),
    }),
    UserModule,
    LessonModule,
    AttendanceModule,
    StudentModule,
    LocationModule,
    SubscriptionTemplateModule,
    SubscriptionModule,
    StatisticModule,
    AuthModule,
    FinanceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
