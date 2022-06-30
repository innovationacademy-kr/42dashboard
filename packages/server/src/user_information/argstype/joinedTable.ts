import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  UserEmploymentAndFound,
  UserEmploymentStatus,
  UserHrdNetUtilize,
  UserInternStatus,
} from 'src/user_job/entity/user_job.entity';
import { UserComputationFund } from 'src/user_payment/entity/user_computation_fund.entity';
import { UserEducationFundState } from 'src/user_payment/entity/user_education_fund_state.entity';
import {
  UserBlackhole,
  UserLapiscineInformation,
  UserLearningData,
  UserLeaveOfAbsence,
  UserProcessProgress,
  UserReasonOfBreak,
} from 'src/user_status/entity/user_status.entity';
import { Entity } from 'typeorm';
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
  created_date: Date;

  @Field((type) => [UserOtherInformation], { nullable: true })
  userOtherInformation: UserOtherInformation[];

  @Field((type) => UserPersonalInformation, { nullable: true })
  userPersonalInformation: UserPersonalInformation; //일대일 이니까

  @Field((type) => UserAccessCardInformation, { nullable: true })
  userAccessCardInformation: UserAccessCardInformation; //일대일 이니까

  @Field((type) => [UserEmploymentAndFound], { nullable: true })
  userEmploymentAndFound: UserEmploymentAndFound[];

  @Field((type) => [UserInternStatus], { nullable: true })
  userInternStatus: UserInternStatus[];

  @Field((type) => [UserHrdNetUtilize], { nullable: true })
  userHrdNetUtilize: UserHrdNetUtilize[];

  @Field((type) => [UserEmploymentStatus], { nullable: true })
  userEmploymentStatus: UserEmploymentStatus[];

  @Field((type) => [UserComputationFund], { nullable: true })
  userComputationFund: UserComputationFund[];

  @Field((type) => [UserEducationFundState], { nullable: true })
  userEducationFundState: UserEducationFundState[];

  @Field((type) => [UserLearningData], { nullable: true })
  userLearningData: UserLearningData[];

  @Field((type) => [UserProcessProgress], { nullable: true })
  userProcessProgress: UserProcessProgress[];

  @Field((type) => [UserBlackhole], { nullable: true })
  userBlackhole: UserBlackhole[];

  @Field((type) => [UserLeaveOfAbsence], { nullable: true })
  userLeaveOfAbsence: UserLeaveOfAbsence[];

  @Field((type) => [UserReasonOfBreak], { nullable: true })
  userReasonOfBreak: UserReasonOfBreak[];

  @Field((type) => [UserLapiscineInformation], { nullable: true })
  userLapiscineInformation: UserLapiscineInformation[];
}
