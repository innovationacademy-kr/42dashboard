import { InjectDataSource } from '@nestjs/typeorm';
import {
  UserEmploymentStatus,
  UserHrdNetUtilize,
  UserHrdNetUtilizeConsent,
  UserOtherEmploymentStatus,
} from 'src/user_job/entity/user_job.entity';
import {
  UserComputationFund,
  UserEducationFundState,
} from 'src/user_payment/entity/user_payment.entity';
import {
  UserBlackhole,
  UserCourseExtension,
  UserInterruptionOfCourse,
  UserLapiscineInformation,
  UserLearningDataAPI,
  UserLeaveOfAbsence,
  UserLoyaltyManagement,
} from 'src/user_status/entity/user_status.entity';
import { DataSource } from 'typeorm';
import { CheckDuplication } from '../argstype/checkDuplication.argstype';
import { UserAccessCardInformation } from '../entity/user_access_card_information.entity';
import { User } from '../entity/user_information.entity';
import { UserOtherInformation } from '../entity/user_other_information.entity';
import { UserPersonalInformation } from '../entity/user_personal_information.entity';

export const entityArray = {
  user: User,
  userPersonalInformation: UserPersonalInformation,
  userCourseExtension: UserCourseExtension,
  userLeaveOfAbsence: UserLeaveOfAbsence,
  userBlackhole: UserBlackhole,
  userInterruptionOfCourse: UserInterruptionOfCourse,
  userLearningDataAPI: UserLearningDataAPI,
  userLoyaltyManagement: UserLoyaltyManagement,
  userEmploymentStatus: UserEmploymentStatus,
  userHrdNetUtilizeConsent: UserHrdNetUtilizeConsent,
  userHrdNetUtilize: UserHrdNetUtilize,
  userOtherEmploymentStatus: UserOtherEmploymentStatus,
  userEducationFundState: UserEducationFundState,
  userComputationFund: UserComputationFund,
  userAccessCardInformation: UserAccessCardInformation,
  userOtherInformation: UserOtherInformation,
  userLapiscineInformation: UserLapiscineInformation,
};

export async function getDomain(
  dataSource,
  checkDuplication: CheckDuplication,
  entitys,
  repoName,
) {
  if (checkDuplication.duplicated === 'N') {
    return await dataSource
      .getRepository(entitys[repoName])
      .createQueryBuilder(`${repoName}`)
      .distinctOn([`${repoName}.${checkDuplication.column}`])
      .orderBy(`${repoName}.${checkDuplication.column}`)
      .getMany();
  } else {
    const res = await dataSource.getRepository(entitys[repoName]).find({});
    console.log(res);
    return res;
  }
}
