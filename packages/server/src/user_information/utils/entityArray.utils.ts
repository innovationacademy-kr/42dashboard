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
import { UserAccessCardInformation } from '../entity/user_access_card_information.entity';
import { User } from '../entity/user_information.entity';
import { UserPersonalInformation } from '../entity/user_personal_information.entity';

const NonValExColumnEntity = [
  User,
  UserPersonalInformation,
  UserCourseExtension,
  UserLeaveOfAbsence,
  UserBlackhole,
  UserInterruptionOfCourse,
  UserLearningDataAPI,
  UserLoyaltyManagement,
  UserEmploymentStatus,
  UserHrdNetUtilize,
  UserHrdNetUtilizeConsent,
  UserOtherEmploymentStatus,
  UserEducationFundState,
  UserComputationFund,
  UserAccessCardInformation,
  UserOtherEmploymentStatus,
  UserLapiscineInformation,
];

const valExColumnEntity = [
  User,
  UserPersonalInformation,
  UserCourseExtension,
  UserLeaveOfAbsence,
  UserBlackhole,
  UserInterruptionOfCourse,
  UserLearningDataAPI,
  UserLoyaltyManagement,
  UserEmploymentStatus,
  UserHrdNetUtilize,
  UserHrdNetUtilizeConsent,
  UserOtherEmploymentStatus,
  UserEducationFundState,
  UserComputationFund,
  UserAccessCardInformation,
  UserOtherEmploymentStatus,
  UserLapiscineInformation,
];

export { NonValExColumnEntity, valExColumnEntity };
