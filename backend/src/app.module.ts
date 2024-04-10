import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        // uri: 'mongodb://127.0.0.1:27017',
        uri: `mongodb://${configService.get('DB_HOST')}:${configService.get('DB_PORT')}`,
      }),
      inject: [ConfigService],
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
