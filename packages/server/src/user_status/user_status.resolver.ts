import { Query, Resolver } from '@nestjs/graphql';
import {
  UserBlackhole,
  UserCourseExtension,
  UserInterruptionOfCourse,
  UserLearningDataAPI,
  UserLeaveOfAbsence,
} from './entity/user_status.entity';
import { UserStatusService } from './user_status.service';

@Resolver()
export class UserStatusResolver {
  constructor(private readonly userStatusService: UserStatusService) {}

  @Query(() => [UserLearningDataAPI])
  getUserLeaningData() {
    return this.userStatusService.getUserLeaningDataAPI();
  }
  @Query(() => [UserCourseExtension])
  getUserCourseExtension() {
    return this.userStatusService.getUserCourseExtension();
  }
  @Query(() => [UserBlackhole])
  getUserBlackhole() {
    return this.userStatusService.getUserBlackhole();
  }
  @Query(() => [UserLeaveOfAbsence])
  getUserLeaveOfAbsence() {
    return this.userStatusService.getUserLeaveOfAbsence();
  }

  @Query(() => UserInterruptionOfCourse)
  getUserInterruptionOfCourse() {
    return this.userStatusService.getUserInterruptionOfCourse();
  }
}
