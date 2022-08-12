import { UserAccessCardInformation } from 'src/user_information/entity/user_access_card_information.entity';
import { User } from 'src/user_information/entity/user_information.entity';
import { UserOtherInformation } from 'src/user_information/entity/user_other_information.entity';
import { UserPersonalInformation } from 'src/user_information/entity/user_personal_information.entity';
import {
  UserEmploymentStatus,
  UserHrdNetUtilize,
  UserHrdNetUtilizeConsent,
  UserOtherEmploymentStatus,
} from 'src/user_job/entity/user_job.entity';
import { UserComputationFund } from 'src/user_payment/entity/user_payment.entity';
import {
  UserBlackhole,
  UserCourseExtension,
  UserInterruptionOfCourse,
  UserLapiscineInformation,
  UserLearningDataAPI,
  UserLeaveOfAbsence,
  UserLoyaltyManagement,
} from 'src/user_status/entity/user_status.entity';

/*
   T extends
      | 'user'
      | 'userPersonalInformation'
      | 'userCourseExtension'
      | 'userLeaveOfAbsence'
      | 'userBlackhole'
      | 'userInterruptionOfCourse'
      | 'userLearningDataAPI'
      | 'userLoyaltyManagement'
      | 'userEmploymentStatus'
      | 'userHrdNetUtilizeConsent'
      | 'userHrdNetUtilize'
      | 'userOtherEmploymentStatus'
      | 'userComputationFund'
      | 'userAccessCardInformation'
      | 'userOtherInformation'
      | 'userLapiscineInformation',
  >(): ReturnTypeByInputType[T] 
*/

export type ReturnTypeByInputType = {
  user: User;
  userPersonalInformation: UserPersonalInformation;
  userCourseExtension: UserCourseExtension;
  userLeaveOfAbsence: UserLeaveOfAbsence;
  userBlackhole: UserBlackhole;
  userInterruptionOfCourse: UserInterruptionOfCourse;
  userLearningDataAPI: UserLearningDataAPI;
  userLoyaltyManagement: UserLoyaltyManagement;
  userEmploymentStatus: UserEmploymentStatus;
  userHrdNetUtilizeConsent: UserHrdNetUtilizeConsent;
  userHrdNetUtilize: UserHrdNetUtilize;
  userOtherEmploymentStatus: UserOtherEmploymentStatus;
  userComputationFund: UserComputationFund;
  userAccessCardInformation: UserAccessCardInformation;
  userOtherInformation: UserOtherInformation;
  userLapiscineInformation: UserLapiscineInformation;
};

export type GetReturnType<T> = T extends 'user'
  ? User
  : T extends 'userPersonalInformation'
  ? UserPersonalInformation
  : T extends 'userCourseExtension'
  ? UserCourseExtension
  : T extends 'userLeaveOfAbsence'
  ? UserLeaveOfAbsence
  : T extends 'userBlackhole'
  ? UserBlackhole
  : T extends 'userInterruptionOfCourse'
  ? UserInterruptionOfCourse
  : T extends 'userLearningDataAPI'
  ? UserLearningDataAPI
  : T extends 'userLoyaltyManagement'
  ? UserLoyaltyManagement
  : T extends 'userEmploymentStatus'
  ? UserEmploymentStatus
  : T extends 'userHrdNetUtilizeConsent'
  ? UserHrdNetUtilizeConsent
  : T extends 'userHrdNetUtilize'
  ? UserHrdNetUtilize
  : T extends 'userOtherEmploymentStatus'
  ? UserOtherEmploymentStatus
  : T extends 'userComputationFund'
  ? UserComputationFund
  : T extends 'userAccessCardInformation'
  ? UserAccessCardInformation
  : T extends 'userOtherInformation'
  ? UserOtherInformation
  : T extends 'userLapiscineInformation'
  ? UserLapiscineInformation
  : never;

export interface allEntityType {
  user: User;
  userPersonalInformation: UserPersonalInformation;
  userCourseExtension: UserCourseExtension;
  userLeaveOfAbsence: UserLeaveOfAbsence;
  userBlackhole: UserBlackhole;
  userInterruptionOfCourse: UserInterruptionOfCourse;
  userLearningDataAPI: UserLearningDataAPI;
  userLoyaltyManagement: UserLoyaltyManagement;
  userEmploymentStatus: UserEmploymentStatus;
  userHrdNetUtilizeConsent: UserHrdNetUtilizeConsent;
  userHrdNetUtilize: UserHrdNetUtilize;
  userOtherEmploymentStatus: UserOtherEmploymentStatus;
  userComputationFund: UserComputationFund;
  userAccessCardInformation: UserAccessCardInformation;
  userOtherInformation: UserOtherInformation;
  userLapiscineInformation: UserLapiscineInformation;
}

// export interface userObj {

// }
// export interface userPersonalInformationObj {

// }
// export interface userCourseExtensionObj {

// }
// export interface userLeaveOfAbsenceObj {

// }
// export interface userBlackholeObj {

// }
// export interface userInterruptionOfCourseObj {

// }
// export interface userLearningDataAPIObj {

// }
// export interface userLoyaltyManagementObj {

// }
// export interface userEmploymentStatusObj {

// }
// export interface userHrdNetUtilizeConsentObj {

// }
// export interface userHrdNetUtilizeObj {

// }
// export interface userOtherEmploymentStatusObj {

// }
// export interface userComputationFundObj {

// }
// export interface userAccessCardInformationObj {

// }
// export interface userOtherInformationObj {

// }
// export interface userLapiscineInformationObj {

// }
