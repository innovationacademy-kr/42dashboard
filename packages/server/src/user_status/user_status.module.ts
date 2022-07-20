import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  UserBlackhole,
  UserCourseExtension,
  UserInterruptionOfCourse,
  UserLapiscineInformation,
  UserLearningDataAPI,
  UserLeaveOfAbsence,
  UserLoyaltyManagement,
} from 'src/user_status/entity/user_status.entity';
import { UserStatusController } from './user_status.controller';
import { UserStatusResolver } from './user_status.resolver';
import { UserStatusService } from './user_status.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserCourseExtension,
      UserInterruptionOfCourse,
      UserBlackhole,
      UserLeaveOfAbsence,
      UserLearningDataAPI,
      UserLapiscineInformation,
      UserLoyaltyManagement,
    ]),
  ],
  controllers: [UserStatusController],
  providers: [UserStatusService, UserStatusResolver],
})
export class UserStatusModule {}
