import { Args, Query, Resolver } from '@nestjs/graphql';
import { CheckDuplication } from 'src/user_information/argstype/checkDuplication.argstype';
import {
  UserBlackhole,
  UserCourseExtension,
  UserInterruptionOfCourse,
  UserLapiscineInformation,
  UserLearningDataAPI,
  UserLeaveOfAbsence,
  UserLoyaltyManagement,
} from './entity/user_status.entity';
import { UserStatusService } from './user_status.service';

@Resolver()
export class UserStatusResolver {
  constructor(private readonly userStatusService: UserStatusService) {}

  @Query(() => [UserLearningDataAPI])
  async getUserLeaningDataAPI(@Args() checkDuplication: CheckDuplication) {
    return this.userStatusService.getUserLeaningDataAPI(checkDuplication);
  }
  @Query(() => [UserLoyaltyManagement])
  async getUserLoyaltyManagement(@Args() checkDuplication: CheckDuplication) {
    return this.userStatusService.getUserLoyaltyManagement(checkDuplication);
  }
  @Query(() => [UserCourseExtension])
  async getUserCourseExtension(@Args() checkDuplication: CheckDuplication) {
    return this.userStatusService.getUserCourseExtension(checkDuplication);
  }
  @Query(() => [UserBlackhole])
  async getUserBlackhole(@Args() checkDuplication: CheckDuplication) {
    return this.userStatusService.getUserBlackhole(checkDuplication);
  }
  @Query(() => [UserLeaveOfAbsence])
  async getUserLeaveOfAbsence(@Args() checkDuplication: CheckDuplication) {
    return this.userStatusService.getUserLeaveOfAbsence(checkDuplication);
  }
  @Query(() => [UserInterruptionOfCourse])
  async getUserInterruptionOfCourse(
    @Args() checkDuplication: CheckDuplication,
  ) {
    return this.userStatusService.getUserInterruptionOfCourse(checkDuplication);
  }
  @Query(() => [UserLapiscineInformation])
  async getUserLapiscineInformation(
    @Args() checkDuplication: CheckDuplication,
  ) {
    return this.userStatusService.getUserLapiscineInformation(checkDuplication);
  }
}
