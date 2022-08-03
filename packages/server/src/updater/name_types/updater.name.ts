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
  SUB_HRDNETUTILIZE_CONSENT_ID,
  SUB_HRDNETUTILIZE_ID,
  SUB_INTERRUPTIONOFCOURSE_ID,
  SUB_LEAVEOFABSENCE_ID,
  SUB_LEVEL_API_ID,
  SUB_LOYALTYMANAGEMENT_ID,
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

export const enum TABLENUM {
  USER = 0,
  USERPERSONAL = 1,
  USERCOURSEEXTENSION = 2,
  USERLEAVEOFABSENCE = 3,
  USERBLACKHOLE = 4,
  USERINTERRUPTIONOFCOURSE = 5,
  USERLEARNINGDATAAPI = 6,
  USERLOYALTYMANAGEMENT = 7,
  USEREMPLOYMENTSTATUS = 8,
  USERHRDNETUTILIZECONSENT = 9,
  USERHRDNETUTILIZE = 10,
  USEROTHEREMPLOYMENTSTATUS = 11,
  USEREDUCATIONFUNDSTATE = 12,
  USERCOMPUTATIONFUND = 13,
  USERACCESSCARDINFORMATION = 14,
  USEROTHERINFORMATION = 15,
  USERLAPISCINEINFORMATION = 16,
  //USERINTERNSTATUS = 16,
}

export const mapObj = [
  //메인1
  [
    //user
    { spName: 'Intra No.', dbName: 'intra_no' },
    { spName: 'Intra ID', dbName: 'intra_id' },
    { spName: '성명', dbName: 'name' },
    { spName: '기수', dbName: 'grade' },
    { spName: '과정시작', dbName: 'start_process_date' },
    { spName: '코알리숑', dbName: 'coalition' },
    { spName: '학적(수동)', dbName: 'academic_state' }, //[api]
    { spName: '특이사항', dbName: 'uniqueness' },
    { spName: '익명화', dbName: 'anonymization' },
  ],
  [
    //userPersonalInformation
    { spName: '지역', dbName: 'region' },
    { spName: '성별', dbName: 'gender' },
    { spName: '생년월일', dbName: 'birthday' },
    { spName: '키값', dbName: 'social_security_key' },
    { spName: '만 나이', dbName: 'age' },
    { spName: '휴대폰', dbName: 'phone_number' }, // [api]
    { spName: '이메일', dbName: 'email' }, // [api]
    //이메일, 전화번호는 api
  ],
  [
    //userCourseExtension
    { spName: '기본종료일자', dbName: 'basic_expiration_date' },
    { spName: '과정연장', dbName: 'request_extension' },
    { spName: '최종 종료일', dbName: 'final_expiration_date' },
    { spName: '과정연장_level', dbName: 'extension_level' },
    { spName: '과정연장_circle', dbName: 'extension_circle' },
  ],
  [
    //userLeaveOfAbsence
    { spName: '휴학', dbName: 'absenced' },
    { spName: '휴학_begin_date', dbName: 'begin_absence_date' },
    { spName: '휴학_end_date', dbName: 'end_absence_date' },
    { spName: '복학_date', dbName: 'return_from_absence_date' },
    { spName: '휴학_reason', dbName: 'absence_reason' },
    { spName: 'AGU_reason', dbName: 'AGU_reason' },
    { spName: '특이사항', dbName: 'uniqueness' },
  ],
  [
    //userBlackhole
    { spName: 'Blackholed', dbName: 'blackholed' },
    { spName: 'Blackholed_date', dbName: 'blackhole_date' },
    { spName: '사유', dbName: 'reason_of_blackhole' },
    { spName: 'Blackholed_level', dbName: 'blackholed_level' },
    { spName: '비고', dbName: 'remarks' },
    //잔여기간, 블랙홀일자는 api -> 추가함
  ],
  [
    //userInterruptionOfCourse
    { spName: '과정중단', dbName: 'breaked' },
    { spName: '과정중단일자', dbName: 'break_date' },
    { spName: '사유', dbName: 'reason_of_break' },
    { spName: 'HRD-Net 중도탈락 처리', dbName: 'HRD_Net_drop_out' },
  ],
  [
    //userLearningDataAPI
    { spName: 'Coalition Score', dbName: 'coalition_score' },
    { spName: 'Scored_date', dbName: 'scored_date' },
    { spName: 'CIRCLE', dbName: 'circle' },
    { spName: 'CIRCLED_date', dbName: 'circled_date' },
    { spName: 'Level', dbName: 'level' }, // [api]
    { spName: 'Leveled_date', dbName: 'leveled_date' }, // [api]
    { spName: 'OUTCIRCLE', dbName: 'outcircle' },
    { spName: 'OUTCIRCLED_date', dbName: 'outcircled_date' },
  ],
  [
    //userLoyaltyManagement
    { spName: '대상기간', dbName: 'loyalty_period' },
    { spName: '대상유무', dbName: 'loyalty_presence' },
    { spName: '서클(대상기간기준)', dbName: 'loyalty_circle' },
  ],
  [
    //userEmploymentStatus
    { spName: '취업현황', dbName: 'employmented' },
    { spName: '취업일자', dbName: 'employment_date' },
    { spName: '사업장명', dbName: 'enterprise' },
  ],
  [
    //userHrdNetUtilizeConsent
    {
      spName: '정보제공동의',
      dbName: 'consent_to_provide_information',
    },
    { spName: '정보제공동의_일자', dbName: 'consented_date' },
  ],
  [
    //userHrdNetUtilize
    { spName: 'HRD-Net_출력_date', dbName: 'hrd_net_date' },
    { spName: '취업여부', dbName: 'employmented' },
    { spName: '취업_사업자등록번호', dbName: 'business_registration_number' },
    { spName: '고용보험가입일', dbName: 'employment_insurance_date' },
    { spName: '기업규모', dbName: 'enterprise_size' },
    { spName: '건강보험취득_사업장명', dbName: 'health_insurance_enterprise' },
  ],
  [
    //userOtherEmploymentStatus
    { spName: '취업일자', dbName: 'employment_date' },
    { spName: '사업장명', dbName: 'enterprise' },
  ],
  [
    //userEducationFundState
    {
      spName: '총 지급 개월',
      dbName: 'total_payment_of_number',
    },
    { spName: '총 지급액', dbName: 'total_payment_of_money' },
    { spName: '지원만료일', dbName: 'payment_end_date' },
    { spName: '지원만료', dbName: 'payment_ended' },
    { spName: '특이사항', dbName: 'uniqueness' },
  ],
  [
    //userComputationFund
    { spName: '지급일', dbName: 'payment_date' },
    { spName: '수령여부', dbName: 'received' },
    { spName: '수령금액', dbName: 'recevied_amount' },
  ],
  [
    //userAccessCardInformation
    { spName: '사진이미지파일', dbName: 'profile_picture_path' },
    {
      spName: '라피신출입카드물리번호',
      dbName: 'lapiscine_physical_number',
    },
    {
      spName: '라피신출입카드논리번호',
      dbName: 'lapiscine_logical_number',
    },
    {
      spName: '본과정출입카드논리번호',
      dbName: 'logical_number_for_main_course',
    },
    {
      spName: '본과정출입카드명',
      dbName: 'name_of_entry_card_for_main_course',
    },
  ],
  [
    // userOtherInformation
    { spName: '최종학력', dbName: 'highest_level_of_education' },
    { spName: '소프트웨어 관련전공여부', dbName: 'majored' },
    { spName: '전공명(복수전공기재)', dbName: 'major_name' },
  ],
  [
    //userLapiscineInformation
    { spName: 'LaPiscine_기수', dbName: 'lapiscine_grade' },
    { spName: 'LaPiscine_차수', dbName: 'lapiscine_degree' },
    { spName: 'LaPiscine_참여이력', dbName: 'record_participate_lapiscine' },
    { spName: 'LaPiscine_final_score', dbName: 'lapiscine_final_score' },
  ],
];

export const pastDataOnSheet = [
  //spread수정해야함!
  //하위1
  {
    //유저
    endPoint: null,
    Id: null,
    columns: mapObj[TABLENUM.USER],
    table: TABLENUM.USER,
  },
  {
    //인적정보
    endPoint: null,
    Id: null,
    columns: mapObj[TABLENUM.USERPERSONAL],
    table: TABLENUM.USERPERSONAL,
  },
  {
    //과정연장
    endPoint: null,
    Id: null,
    columns: mapObj[TABLENUM.USERCOURSEEXTENSION],
    table: TABLENUM.USERCOURSEEXTENSION,
  },
  {
    // 휴학
    endPoint: SPREAD_END_POINT,
    Id: [SUB_LEAVEOFABSENCE_ID],
    columns: mapObj[TABLENUM.USERLEAVEOFABSENCE],
    table: TABLENUM.USERLEAVEOFABSENCE,
  },
  {
    // 블랙홀
    endPoint: SPREAD_END_POINT,
    Id: [SUB_BLACKHOLE_ID],
    columns: mapObj[TABLENUM.USERBLACKHOLE],
    table: TABLENUM.USERBLACKHOLE,
  },
  {
    // 과정중단
    endPoint: SPREAD_END_POINT,
    Id: [SUB_INTERRUPTIONOFCOURSE_ID],
    columns: mapObj[TABLENUM.USERINTERRUPTIONOFCOURSE],
    table: TABLENUM.USERINTERRUPTIONOFCOURSE,
  },
  {
    // 학습데이터 API
    endPoint: null,
    Id: null,
    columns: mapObj[TABLENUM.USERLEARNINGDATAAPI],
    table: TABLENUM.USERLEARNINGDATAAPI,
  },
  {
    // 로열티 관리
    endPoint: SPREAD_END_POINT,
    Id: [SUB_LOYALTYMANAGEMENT_ID],
    columns: mapObj[TABLENUM.USERLOYALTYMANAGEMENT],
    table: TABLENUM.USERLOYALTYMANAGEMENT,
  },
  {
    // 취업현황
    endPoint: SPREAD_END_POINT,
    Id: [SUB_EMPLOYMENTSTATUS_ID],
    columns: mapObj[TABLENUM.USEREMPLOYMENTSTATUS],
    table: TABLENUM.USEREMPLOYMENTSTATUS,
  },
  {
    // HRD-Net_consent
    endPoint: null,
    Id: null,
    columns: mapObj[TABLENUM.USERHRDNETUTILIZECONSENT],
    table: TABLENUM.USERHRDNETUTILIZECONSENT,
  },
  {
    // HRD-Net_data
    endPoint: SPREAD_END_POINT,
    Id: [SUB_HRDNETUTILIZE_ID],
    columns: mapObj[TABLENUM.USERHRDNETUTILIZE],
    table: TABLENUM.USERHRDNETUTILIZE,
  },
  {
    // 취업_기타수집_data
    endPoint: SPREAD_END_POINT,
    Id: [SUB_OTHEREMPLOYMENTSTATUS_ID],
    columns: mapObj[TABLENUM.USEROTHEREMPLOYMENTSTATUS],
    table: TABLENUM.USEROTHEREMPLOYMENTSTATUS,
  },
  {
    // 지원금관리
    endPoint: SPREAD_END_POINT,
    Id: [SUB_EDUCATIONFUNDSTATE_ID],
    columns: mapObj[TABLENUM.USEREDUCATIONFUNDSTATE],
    table: TABLENUM.USEREDUCATIONFUNDSTATE,
  },
  {
    // 지원금 산정
    endPoint: null,
    Id: null,
    columns: mapObj[TABLENUM.USERCOMPUTATIONFUND],
    table: TABLENUM.USERCOMPUTATIONFUND,
  },
  {
    // 출입카드_info
    endPoint: null,
    Id: null,
    columns: mapObj[TABLENUM.USERACCESSCARDINFORMATION],
    table: TABLENUM.USERACCESSCARDINFORMATION,
  },
  {
    // 기타정보
    endPoint: null,
    Id: null,
    columns: mapObj[TABLENUM.USEROTHERINFORMATION],
    table: TABLENUM.USEROTHERINFORMATION,
  },
  {
    // La piscine
    endPoint: null,
    Id: null,
    columns: mapObj[TABLENUM.USERLAPISCINEINFORMATION],
    table: TABLENUM.USERLAPISCINEINFORMATION,
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
    table: TABLENUM.USERCOMPUTATIONFUND,
  },
  {
    endPoint: SPREAD_END_POINT,
    Id: [SUB_COALITION_API_ID, SUB_CIRCLE_API_ID, SUB_LEVEL_API_ID],
    table: TABLENUM.USERLEARNINGDATAAPI,
  },
  {
    endPoint: SPREAD_END_POINT,
    Id: [SUB_HRDNETUTILIZE_CONSENT_ID],
    table: TABLENUM.USERHRDNETUTILIZECONSENT,
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
  userEducationFundState: 'user_education_fund_state',
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
    expired_date: '999-12-31',
  },

  user_personal_information: {
    validate_date: '9999-12-31',
    expired_date: '999-12-31',
  },

  user_course_extension: {
    basic_expiration_date: '9999-12-31',
    final_expiration_date: '9999-12-31',
    validate_date: '9999-12-31',
    expired_date: '999-12-31',
  },

  user_leave_of_absence: {
    begin_absence_date: '9999-12-31',
    end_absence_date: '9999-12-31',
    return_from_absence_date: '9999-12-31',
    validate_date: '9999-12-31',
    expired_date: '999-12-31',
  },

  user_blackhole: {
    //remaining_period: 0,
    blackhost_date: '9999-12-31',
    blackholed_level: 0,
    validate_date: '9999-12-31',
    expired_date: '999-12-31',
  },

  user_interruption_of_course: {
    break_date: '9999-12-31', //이름 변경 요망validate_date: '9999-12-31',
    expired_date: '999-12-31',
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
    expired_date: '999-12-31',
  },

  user_loyalty_management: {
    royalty_period: '9999년 4분기',
    royalty_presence: 'N',
    royalty_circle: 0,
    validate_date: '9999-12-31',
    expired_date: '999-12-31',
  },

  user_employment_status: {
    employment_date: '9999-12-31',
    employment: '미취업',
    validate_date: '9999-12-31',
    expired_date: '999-12-31',
  },

  user_hrd_net_utilize_consent: {
    consent_to_provide_information: 'N',
    consented_date: '9999-12-31',
    validate_date: '9999-12-31',
    expired_date: '999-12-31',
  },

  user_hrd_net_utilize: {
    hrd_net_date: '9999-12-31',
    employmented: 'N',
    employment_insurance_date: '9999-12-31',
    validate_date: '9999-12-31',
    expired_date: '999-12-31',
  },

  user_other_employment_status: {
    employment_date: '9999-12-31',
    validate_date: '9999-12-31',
    expired_date: '999-12-31',
  },

  user_education_fund_state: {
    total_payment_of_number: 0,
    total_payment_of_money: '0',
    payment_end_date: '9999-12-31',
    //uniqueness: '0',
    validate_date: '9999-12-31',
    expired_date: '999-12-31',
  },

  //하위시트에서 받아올 때는 makeAColumnInTable에서 초기화를 함
  user_computaion_fund: {
    payment_date: '9999-12-31',
    received: 'N',
    recevied_amount: 0,
    validate_date: '9999-12-31',
    expired_date: '999-12-31',
  },

  user_access_card_information: {},

  user_other_information: {
    majored: '비전공',
    validate_date: '9999-12-31',
    expired_date: '999-12-31',
  },

  user_lapiscine_information: {
    lapiscine_final_score: 0,
    // lapiscine_grade: 9999,
    // lapiscine_degree: 9999,
    // participate_lapicin: 9999,
    // number_of_rapicin_participation: 9999,
    validate_date: '9999-12-31',
    expired_date: '999-12-31',
  },
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
  [repoKeys.userEducationFundState]: 'validate_date',
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
  [repoKeys.userEducationFundState]: UserEducationFundState,
  [repoKeys.userComputationFund]: UserComputationFund,
  [repoKeys.userAccessCardInformation]: UserAccessCardInformation,
  [repoKeys.userOtherInformation]: UserOtherInformation,
  [repoKeys.userLapiscineInformation]: UserLapiscineInformation,
};
