import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  UserBlackhole,
  UserLapiscineInformation,
  UserLearningData,
  UserLeaveOfAbsence,
  UserProcessProgress,
  UserReasonOfBreak,
} from 'src/user_status/entity/user_status.entity';
import { UserStatusController } from './user_status.controller';
import { UserStatusResolver } from './user_status.resolver';
import { UserStatusService } from './user_status.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserLearningData,
      UserProcessProgress,
      UserBlackhole,
      UserLeaveOfAbsence,
      UserReasonOfBreak,
      UserLapiscineInformation,
    ]),
  ],
  controllers: [UserStatusController],
  providers: [UserStatusService, UserStatusResolver],
})
export class UserStatusModule {}
