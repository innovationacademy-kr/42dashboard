//테이블의 컬럼을 나열해 놓았습니다.
//컬럼 추가시 여기에 추가해야함

import {
  SPREAD_END_POINT,
  SUB_BLACKHOLE_ID,
  SUB_CIRCLE_API_ID,
  SUB_COALITION_API_ID,
  SUB_COMPUTATIONFUND2020_ID,
  SUB_COMPUTATIONFUND2021_ID,
  SUB_COMPUTATIONFUND2022_ID,
  SUB_EDUCATIONFUNDSTATE_ID,
  SUB_EMPLOYMENTSTATUS_ID,
  SUB_HRDNETUTILIZE_22_1_ID,
  SUB_HRDNETUTILIZE_22_2_ID,
  SUB_HRDNETUTILIZE_22_3_ID,
  SUB_HRDNETUTILIZE_22_4_ID,
  SUB_HRDNETUTILIZE_22_5_ID,
  SUB_HRDNETUTILIZE_22_6_ID,
  SUB_HRDNETUTILIZE_CONSENT_ID,
  SUB_INTERRUPTIONOFCOURSE_ID,
  SUB_LEAVEOFABSENCE_ID,
  SUB_LEVEL_API_ID,
  SUB_LOYALTYMANAGEMENT_22_1_ID,
  SUB_LOYALTYMANAGEMENT_22_2_ID,
  SUB_OTHEREMPLOYMENTSTATUS_ID,
} from 'src/config/key';
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
import {
  UserComputationFund,
  // UserEducationFundState,
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
import { EntityColumn } from 'src/common/EntityColumn';

export const LOCALTIME = 32400000;

// export const enum TABLENUM {
//   USER = 0,
//   USERPERSONAL = 1,
//   USERCOURSEEXTENSION = 2,
//   USERLEAVEOFABSENCE = 3,
//   USERBLACKHOLE = 4,
//   USERINTERRUPTIONOFCOURSE = 5,
//   USERLEARNINGDATAAPI = 6,
//   USERLOYALTYMANAGEMENT = 7,
//   USEREMPLOYMENTSTATUS = 8,
//   USERHRDNETUTILIZECONSENT = 9,
//   USERHRDNETUTILIZE = 10,
//   USEROTHEREMPLOYMENTSTATUS = 11,
//   USEREDUCATIONFUNDSTATE = 12,
//   USERCOMPUTATIONFUND = 13,
//   USERACCESSCARDINFORMATION = 14,
//   USEROTHERINFORMATION = 15,
//   USERLAPISCINEINFORMATION = 16,
// }

export const pastDataOnSheet = [
  //spread수정해야함!
  //하위1
  {
    //유저
    endPoint: null,
    Id: null,
    columns: EntityColumn['User'],
    table: 'User',
  },
  {
    //인적정보
    endPoint: null,
    Id: null,
    columns: EntityColumn['UserPersonalInformation'],
    table: 'UserPersonalInformation',
  },
  {
    //과정연장
    endPoint: null,
    Id: null,
    columns: EntityColumn['UserCourseExtension'],
    table: 'UserCourseExtension',
  },
  {
    // 휴학
    endPoint: SPREAD_END_POINT,
    Id: [SUB_LEAVEOFABSENCE_ID],
    columns: EntityColumn['UserLeaveOfAbsence'],
    table: 'UserLeaveOfAbsence',
  },
  {
    // 블랙홀
    endPoint: SPREAD_END_POINT,
    Id: [SUB_BLACKHOLE_ID],
    columns: EntityColumn['UserBlackhole'],
    table: 'UserBlackhole',
  },
  {
    // 과정중단
    endPoint: SPREAD_END_POINT,
    Id: [SUB_INTERRUPTIONOFCOURSE_ID],
    columns: EntityColumn['UserInterruptionOfCourse'],
    table: 'UserInterruptionOfCourse',
  },
  {
    // 학습데이터 API
    endPoint: null,
    Id: null,
    columns: EntityColumn['UserLearningDataAPI'],
    table: 'UserLearningDataAPI',
  },
  {
    // 로열티 관리
    endPoint: SPREAD_END_POINT,
    Id: [SUB_LOYALTYMANAGEMENT_22_1_ID, SUB_LOYALTYMANAGEMENT_22_2_ID],
    columns: EntityColumn['UserLoyaltyManagement'],
    table: 'UserLoyaltyManagement',
  },
  {
    // 취업현황
    endPoint: SPREAD_END_POINT,
    Id: [SUB_EMPLOYMENTSTATUS_ID],
    columns: EntityColumn['UserEmploymentStatus'],
    table: 'UserEmploymentStatus',
  },
  {
    // HRD-Net_consent
    endPoint: null,
    Id: null,
    columns: EntityColumn['UserHrdNetUtilizeConsent'],
    table: 'UserHrdNetUtilizeConsent',
  },
  {
    // HRD-Net_data
    endPoint: SPREAD_END_POINT,
    Id: [
      SUB_HRDNETUTILIZE_22_1_ID,
      SUB_HRDNETUTILIZE_22_2_ID,
      SUB_HRDNETUTILIZE_22_3_ID,
      SUB_HRDNETUTILIZE_22_4_ID,
      SUB_HRDNETUTILIZE_22_5_ID,
      SUB_HRDNETUTILIZE_22_6_ID,
    ],
    columns: EntityColumn['UserHrdNetUtilize'],
    table: 'UserHrdNetUtilize',
  },
  {
    // 취업_기타수집_data
    endPoint: SPREAD_END_POINT,
    Id: [SUB_OTHEREMPLOYMENTSTATUS_ID],
    columns: EntityColumn['UserOtherEmploymentStatus'],
    table: 'UserOtherEmploymentStatus',
  },
  // {
  //   // 지원금관리
  //   endPoint: SPREAD_END_POINT,
  //   Id: [SUB_EDUCATIONFUNDSTATE_ID],
  //   columns: EntityColumn['UserEducationFundState'],
  //   table: 'UserEducationFundState',
  // },
  {
    // 지원금 산정
    endPoint: null,
    Id: null,
    columns: EntityColumn['UserComputationFund'],
    table: 'UserComputationFund',
  },
  {
    // 출입카드_info
    endPoint: null,
    Id: null,
    columns: EntityColumn['UserAccessCardInformation'],
    table: 'UserAccessCardInformation',
  },
  {
    // 기타정보
    endPoint: null,
    Id: null,
    columns: EntityColumn['UserOtherInformation'],
    table: 'UserOtherInformation',
  },
  {
    // La piscine
    endPoint: null,
    Id: null,
    columns: EntityColumn['UserLapiscineInformation'],
    table: 'UserLapiscineInformation',
  },
];

export const pastDataOnColumn = [
  //하위컬럼1
  {
    endPoint: SPREAD_END_POINT,
    Id: [
      SUB_COMPUTATIONFUND2020_ID,
      SUB_COMPUTATIONFUND2021_ID,
      SUB_COMPUTATIONFUND2022_ID,
    ],
    table: 'UserComputationFund',
  },
  {
    endPoint: SPREAD_END_POINT,
    Id: [SUB_COALITION_API_ID, SUB_CIRCLE_API_ID, SUB_LEVEL_API_ID],
    table: 'UserLearningDataAPI',
  },
  {
    endPoint: SPREAD_END_POINT,
    Id: [SUB_HRDNETUTILIZE_CONSENT_ID],
    table: 'UserHrdNetUtilizeConsent',
  },
];

export const apiTable = ['학습데이터'];

//key 값만 필요하지만, 지칭하는 repo를 명확하게 하기 위해서 value도 적었음
export const repoKeys = {
  user: 'user',
  userPersonal: 'user_personal_information',
  userCourseExtension: 'user_course_extension',
  userLeaveOfAbsence: 'user_leave_of_absence',
  userBlackhole: 'user_blackhole',
  userInterruptionOfCourse: 'user_interruption_of_course',
  userLearningDataAPI: 'user_learning_data_api',
  userLoyaltyManagement: 'user_loyalty_management',
  userEmploymentStatus: 'user_employment_status',
  userHrdNetUtilizeConsent: 'user_hrd_net_utilize_consent',
  userHrdNetUtilize: 'user_hrd_net_utilize',
  userOtherEmploymentStatus: 'user_other_employment_status',
  // userEducationFundState: 'user_education_fund_state',
  userComputationFund: 'user_computation_fund',
  userAccessCardInformation: 'user_access_card_information',
  userOtherInformation: 'user_other_information',
  userLapiscineInformation: 'user_lapiscine_information',
};

export const enum DEFAULT_VALUE {
  NOT = 0, //조건절에 0이 아닌 값으로 넣기 위해 1부터 시작
  DEFAULT = 1,
  CHANGED = 2,
  DATE = 3,
}

//erd 를 참조하여 컬럼별 default 값을 찾아 스프레드에 null이 들어와도 db default 값과 구분하기 위한 객체
export const defaultVALUE = {
  user: {
    intra_id: 'NOT_EXIST',
    name: 'NO_NAME',
    grade: '0기',
    academic_state: 'BLACK_HOLE',
    start_process_date: '9999-12-31',
    validate_date: '9999-12-31',
    expired_date: '9999-12-31',
  },

  user_personal_information: {
    validate_date: '9999-12-31',
    expired_date: '9999-12-31',
  },

  user_course_extension: {
    basic_expiration_date: '9999-12-31',
    final_expiration_date: '9999-12-31',
    validate_date: '9999-12-31',
    expired_date: '9999-12-31',
  },

  user_leave_of_absence: {
    begin_absence_date: '9999-12-31',
    end_absence_date: '9999-12-31',
    return_from_absence_date: '9999-12-31',
    validate_date: '9999-12-31',
    expired_date: '9999-12-31',
  },

  user_blackhole: {
    //remaining_period: 0,
    blackhost_date: '9999-12-31',
    blackholed_level: 0,
    validate_date: '9999-12-31',
    expired_date: '9999-12-31',
  },

  user_interruption_of_course: {
    break_date: '9999-12-31', //이름 변경 요망validate_date: '9999-12-31',
    expired_date: '9999-12-31',
  },

  user_learnig_data_api: {
    coalition_score: 0,
    scored_date: '9999-12-31',
    circle: 0,
    circled_date: '9999-12-31',
    level: 0,
    leveled_date: '9999-12-31',
    outcircle: 'N',
    outcircled_date: '9999-12-31',
    validate_date: '9999-12-31',
    expired_date: '9999-12-31',
  },

  user_loyalty_management: {
    royalty_period: '9999년 4분기',
    royalty_presence: 'N',
    royalty_circle: 0,
    validate_date: '9999-12-31',
    expired_date: '9999-12-31',
  },

  user_employment_status: {
    employment_date: '9999-12-31',
    employmented: '미취업',
    validate_date: '9999-12-31',
    expired_date: '9999-12-31',
  },

  user_hrd_net_utilize_consent: {
    consent_to_provide_information: 'N',
    consented_date: '9999-12-31',
    validate_date: '9999-12-31',
    expired_date: '9999-12-31',
  },

  user_hrd_net_utilize: {
    hrd_net_date: '9999-12-31',
    employmented: 'N',
    employment_insurance_date: '9999-12-31',
    validate_date: '9999-12-31',
    expired_date: '9999-12-31',
  },

  user_other_employment_status: {
    employment_date: '9999-12-31',
    validate_date: '9999-12-31',
    expired_date: '9999-12-31',
  },

  // user_education_fund_state: {
  //   total_payment_of_number: 0,
  //   total_payment_of_money: '0',
  //   payment_end_date: '9999-12-31',
  //   //uniqueness: '0',
  //   validate_date: '9999-12-31',
  //   expired_date: '9999-12-31',
  // },

  //하위시트에서 받아올 때는 makeAColumnInTable에서 초기화를 함
  user_computation_fund: {
    payment_date: '9999-12-31',
    received: 'N',
    recevied_amount: 0,
    validate_date: '9999-12-31',
    expired_date: '9999-12-31',
    //아래 컬럼들은 spread에 없어 서버에서 처리하여 저장하는 데이터
    total_payment_of_number: 0,
    total_payment_of_money: 0,
    total_payment_period_number: 0,
    payment_end_date: '9999-12-31',
    payment_ended: '지원',
  },

  user_access_card_information: {
    validate_date: '9999-12-31',
    expired_date: '9999-12-31',
  },

  user_other_information: {
    majored: '비전공',
    validate_date: '9999-12-31',
    expired_date: '9999-12-31',
  },

  user_lapiscine_information: {
    lapiscine_final_score: 0,
    // lapiscine_grade: 9999,
    // lapiscine_degree: 9999,
    // participate_lapicin: 9999,
    // number_of_rapicin_participation: 9999,
    validate_date: '9999-12-31',
    expired_date: '9999-12-31',
  },
};

export const oldDateTable = {
  [repoKeys.user]: 'validate_date',
  [repoKeys.userPersonal]: 'validate_date',
  [repoKeys.userCourseExtension]: 'validate_date',
  [repoKeys.userLeaveOfAbsence]: 'validate_date',
  [repoKeys.userBlackhole]: 'validate_date',
  [repoKeys.userInterruptionOfCourse]: 'validate_date',
  [repoKeys.userLearningDataAPI]: 'validate_date',
  [repoKeys.userLoyaltyManagement]: 'validate_date',
  [repoKeys.userEmploymentStatus]: 'validate_date',
  [repoKeys.userHrdNetUtilizeConsent]: 'validate_date',
  [repoKeys.userHrdNetUtilize]: 'validate_date',
  [repoKeys.userOtherEmploymentStatus]: 'validate_date',
  [repoKeys.userEducationFundState]: 'validate_date',
  [repoKeys.userComputationFund]: 'payment_date',
  [repoKeys.userAccessCardInformation]: 'validate_date',
  [repoKeys.userOtherInformation]: 'validate_date',
  [repoKeys.userLapiscineInformation]: 'validate_date',
};

export const dateTable = {
  [repoKeys.user]: 'validate_date',
  [repoKeys.userPersonal]: 'validate_date',
  [repoKeys.userCourseExtension]: 'validate_date',
  [repoKeys.userLeaveOfAbsence]: 'validate_date',
  [repoKeys.userBlackhole]: 'validate_date',
  [repoKeys.userInterruptionOfCourse]: 'validate_date',
  [repoKeys.userLearningDataAPI]: 'validate_date',
  [repoKeys.userLoyaltyManagement]: 'validate_date',
  [repoKeys.userEmploymentStatus]: 'validate_date',
  [repoKeys.userHrdNetUtilizeConsent]: 'validate_date',
  [repoKeys.userHrdNetUtilize]: 'validate_date',
  [repoKeys.userOtherEmploymentStatus]: 'validate_date',
  // [repoKeys.userEducationFundState]: 'validate_date',
  [repoKeys.userComputationFund]: 'validate_date',
  [repoKeys.userAccessCardInformation]: 'validate_date',
  [repoKeys.userOtherInformation]: 'validate_date',
  [repoKeys.userLapiscineInformation]: 'validate_date',
};

export const classType = {
  [repoKeys.user]: User,
  [repoKeys.userPersonal]: UserPersonalInformation,
  [repoKeys.userCourseExtension]: UserCourseExtension,
  [repoKeys.userLeaveOfAbsence]: UserLeaveOfAbsence,
  [repoKeys.userBlackhole]: UserBlackhole,
  [repoKeys.userInterruptionOfCourse]: UserInterruptionOfCourse,
  [repoKeys.userLearningDataAPI]: UserLearningDataAPI,
  [repoKeys.userLoyaltyManagement]: UserLoyaltyManagement,
  [repoKeys.userEmploymentStatus]: UserEmploymentStatus,
  [repoKeys.userHrdNetUtilizeConsent]: UserHrdNetUtilizeConsent,
  [repoKeys.userHrdNetUtilize]: UserHrdNetUtilize,
  [repoKeys.userOtherEmploymentStatus]: UserOtherEmploymentStatus,
  // [repoKeys.userEducationFundState]: UserEducationFundState,
  [repoKeys.userComputationFund]: UserComputationFund,
  [repoKeys.userAccessCardInformation]: UserAccessCardInformation,
  [repoKeys.userOtherInformation]: UserOtherInformation,
  [repoKeys.userLapiscineInformation]: UserLapiscineInformation,
};

//db에서 직접 처리해야 하는 데이터가 많아질 경우 관리하기 위한 obj
export const autoProcessingDataObj = {
  [repoKeys.userComputationFund]: {
    totalPaymentOfNumber: 'total_payment_of_number',
    totalPaymentOfMoney: 'total_payment_of_money',
    totalPaymentPeriod: 'total_payment_period_number',
    paymentEndDate: 'payment_end_date',
    paymentEnded: 'payment_ended',
  },
};

//집계되는 컬럼을 식별하기 위한 객체
export const aggregateDataObj = {
  [repoKeys.userComputationFund]: {
    //컬럼 이름으로 조회하므로 스네이크 표기법
    total_payment_of_number: {
      aggregateColumn: 'received',
      operator: 'COUNT',
      value: 'Y',
    },
    total_payment_of_money: {
      aggregateColumn: 'recevied_amount',
      operator: 'SUM',
      value: 0,
    },
    total_payment_period_number: {
      aggregateColumn: 'received',
      operator: 'COUNT',
      value: undefined,
    },
  },
};
