import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  UserOtherEmploymentStatus,
  UserEmploymentStatus,
  UserHrdNetUtilize,
  UserHrdNetUtilizeConsent,
  //UserInternStatus,
} from 'src/user_job/entity/user_job.entity';
import {
  UserComputationFund,
  UserEducationFundState,
} from 'src/user_payment/entity/user_payment.entity';
import {
  UserLearningDataAPI,
  UserCourseExtension,
  UserBlackhole,
  UserLapiscineInformation,
  UserLeaveOfAbsence,
  UserInterruptionOfCourse,
  UserLoyaltyManagement,
} from 'src/user_status/entity/user_status.entity';
import { UserAccessCardInformation } from '../entity/user_access_card_information.entity';
import { UserOtherInformation } from '../entity/user_other_information.entity';
import { UserPersonalInformation } from '../entity/user_personal_information.entity';

@ObjectType('JoinedTable')
export class JoinedTable {
  @Field((type) => Int)
  intra_no: number;

  @Field({ nullable: true })
  intra_id: string;

  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  grade: string;

  @Field({ nullable: true })
  start_process: Date;

  @Field({ nullable: true })
  academic_state: string;

  @Field({ nullable: true })
  coalition: string;

  @Field({ nullable: true })
  uniqueness: string;

  @Field({ nullable: true })
  anonymization: Date;

  @Field({ nullable: true })
  created_date: Date;

  @Field((type) => [UserOtherInformation], { nullable: true })
  userOtherInformation: UserOtherInformation[];

  @Field((type) => [UserPersonalInformation], { nullable: true })
  userPersonalInformation: UserPersonalInformation[]; //일대일 이니까 -> DB에서는 그럴지몰라도 반환값에서는 배열로반환

  @Field((type) => [UserAccessCardInformation], { nullable: true })
  userAccessCardInformation: UserAccessCardInformation[]; //일대일 이니까 -> DB에서는 그럴지몰라도 반환값에서는 배열로반환

  // @Field((type) => [UserInternStatus], { nullable: true })
  // userInternStatus: UserInternStatus[];

  @Field((type) => [UserHrdNetUtilize], { nullable: true })
  userHrdNetUtilize: UserHrdNetUtilize[];

  @Field((type) => [UserHrdNetUtilizeConsent], { nullable: true })
  userHrdNetUtilizeConsent: UserHrdNetUtilizeConsent[];

  @Field((type) => [UserEmploymentStatus], { nullable: true })
  userEmploymentStatus: UserEmploymentStatus[];

  @Field((type) => [UserComputationFund], { nullable: true })
  userComputationFund: UserComputationFund[];

  @Field((type) => [UserOtherEmploymentStatus], { nullable: true })
  userOtherEmploymentStatus: UserOtherEmploymentStatus[];

  @Field((type) => [UserEducationFundState], { nullable: true })
  userEducationFundState: UserEducationFundState[];

  @Field((type) => [UserLearningDataAPI], { nullable: true })
  userLearningDataAPI: UserLearningDataAPI[];

  @Field((type) => [UserCourseExtension], { nullable: true })
  userCourseExtension: UserCourseExtension[];

  @Field((type) => [UserBlackhole], { nullable: true })
  userBlackhole: UserBlackhole[];

  @Field((type) => [UserLoyaltyManagement], { nullable: true })
  userLoyaltyManagement: UserLoyaltyManagement[];

  @Field((type) => [UserLeaveOfAbsence], { nullable: true })
  userLeaveOfAbsence: UserLeaveOfAbsence[];

  @Field((type) => [UserInterruptionOfCourse], { nullable: true })
  userInterruptionOfCourse: UserInterruptionOfCourse[];

  @Field((type) => [UserLapiscineInformation], { nullable: true })
  userLapiscineInformation: UserLapiscineInformation[];
}
