import { Query, Resolver } from '@nestjs/graphql';
import {
  UserBlackhole,
  UserLearningData,
  UserLeaveOfAbsence,
  UserProcessProgress,
  UserReasonOfBreak,
} from './entity/user_status.entity';
import { UserStatusService } from './user_status.service';

@Resolver()
export class UserStatusResolver {
  constructor(private readonly userStatusService: UserStatusService) {}

  @Query(() => [UserLearningData])
  getUserLeaningData() {
    return this.userStatusService.getUserLeaningData();
  }
  @Query(() => [UserProcessProgress])
  getUserProcessProgress() {
    return this.userStatusService.getUserProcessProgress();
  }
  @Query(() => [UserBlackhole])
  getUserBlackhole() {
    return this.userStatusService.getUserBlackhole();
  }
  @Query(() => [UserLeaveOfAbsence])
  getUserLeaveOfAbsence() {
    return this.userStatusService.getUserLeaveOfAbsence();
  }

  @Query(() => UserReasonOfBreak)
  getUserReasonOfBreak() {
    return this.userStatusService.getUserReasonOfBreak();
  }
}
