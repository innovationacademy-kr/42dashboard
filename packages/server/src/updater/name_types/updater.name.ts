//테이블의 컬럼을 나열해 놓았습니다.
//컬럼 추가시 여기에 추가해야함

import { isNonNullType } from 'graphql';
import {
  SPREAD_END_POINT,
  SUB_BLACKHOLE_ID,
  SUB_CIRCLE_API_ID,
  SUB_COALITION_API_ID,
  SUB_COMPUTATIONFUND2020_ID,
  SUB_COMPUTATIONFUND2021_ID,
  SUB_COMPUTATIONFUND2022_ID,
  SUB_COMPUTATIONFUND_ID,
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
  USERACCESSCARD = 14,
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
    { spName: '과정시작', dbName: 'start_process' },
    { spName: '코알리숑', dbName: 'coalition' },
    { spName: '학적', dbName: 'academic_state' }, // [api] //api로 받아올 수 있다는데 doyun님께 여쭤볼 것
    { spName: '특이사항', dbName: 'uniqueness' }, //테이블에 없음
    { spName: '익명화', dbName: 'anonymization' },
  ],
  [
    //userpersonal
    { spName: '인적정보 지역', dbName: 'region' },
    { spName: '성별', dbName: 'gender' },
    { spName: '생년월일', dbName: 'birthday' },
    { spName: '키값', dbName: 'social_security_key' },
    { spName: '만 나이', dbName: 'age' }, //테이블에 없음
    { spName: '휴대폰', dbName: 'phone_number' }, // [api]
    { spName: '이메일', dbName: 'email' }, // [api]
    //이메일, 전화번호는 api
  ],
  [
    //userProcessProgress -> userCourseExtension
    { spName: '과정연장 기본종료일자', dbName: 'basic_expiration_date' },
    { spName: '과정연장', dbName: 'request_extension' },
    { spName: '최종 종료일', dbName: 'final_expiration_date' },
    { spName: '과정연장_level', dbName: 'extension_level' },
    { spName: '과정연장_circle', dbName: 'extension_circle' },
  ],
  [
    //userLeaveOfAbsence (+ 휴학기간)
    { spName: '휴학 휴학', dbName: 'absenced' }, //테이블에 없음
    { spName: '휴학_begin_date', dbName: 'begin_absence_date' },
    { spName: '휴학_end_date', dbName: 'end_absence_date' },
    { spName: '복학_date', dbName: 'return_from_absence_date' },
    { spName: '휴학_reason', dbName: 'absence_reason' },
    { spName: 'AGU_reason', dbName: 'AGU_reason' },
    { spName: '기타', dbName: 'remarks' },
  ],
  [
    //userBlackhole
    { spName: 'BLACKHOLE Blackholed', dbName: 'blackholed' },
    { spName: 'Blackholed_date', dbName: 'blackhole_date' },
    { spName: '사유', dbName: 'reason_of_blackhole' },
    { spName: 'Blackholed_level', dbName: 'blackholed_level' },
    { spName: '비고', dbName: 'remarks' },
    //잔여기간, 블랙홀일자는 api -> 추가함
  ],
  [
    //userReasonOfBreak -> userInterruptionOfCourse
    { spName: '과정중단 과정중단', dbName: 'breaked' },
    { spName: '과정중단 과정중단일자', dbName: 'date_of_break' },
    { spName: '사유', dbName: 'reason_of_break' },
    { spName: 'HRD-Net 중도탈락 처리', dbName: 'HRD_Net_drop_out' },
  ],
  [
    //userLearningData -> userLearningDataAPI
    { spName: '학습데이터(API) Coalition Score', dbName: 'coalition_score' },
    { spName: 'Scored_date', dbName: 'scored_date' },
    { spName: 'CIRCLE', dbName: 'circle' },
    { spName: 'CIRCLED_date', dbName: 'circled_date' },
    { spName: 'Level', dbName: 'level' }, // [api]
    { spName: 'Leveled_date', dbName: 'leveled_date' }, // [api]
    { spName: 'OUTCIRCLE', dbName: 'outcircle' },
    { spName: 'OUTCIRCLED_date', dbName: 'outcircled_date' },
  ],
  [
    //로열티 관리 userLoyaltyManagement
    { spName: '로열티 관리 대상기간', dbName: 'royalty_period' },
    { spName: '대상유무', dbName: 'royalty_presence' },
    { spName: '서클(대상기간기준)', dbName: 'royalty_circle' },
  ],
  [
    //userEmploymentStatus
    { spName: '취업현황 취업현황', dbName: 'employmented' },
    { spName: '취업일자', dbName: 'employment_date' },
    { spName: '사업장명', dbName: 'enterprise' },
  ],
  [
    //userHrdNetUtilizeConsent
    {
      spName: 'HRD-Net 동의 정보제공동의',
      dbName: 'consent_to_provide_information', //하위시트 참고 삭제고려
    }, //제거해야할 수도
    { spName: '정보제공동의_일자', dbName: 'consented_date' },
  ],
  [
    //userHrdNetUtilize
    { spName: 'HRD-Net_data HRD-Net_출력_date', dbName: 'hrd_net_date' },
    { spName: '취업여부', dbName: 'employmented' }, //하위시트 참고 새롭게 추가
    { spName: '취업_사업자등록번호', dbName: 'business_registration_number' },
    { spName: '고용보험가입일', dbName: 'employment_insurance_date' }, //하위시트 참고 새롭게 추가
    { spName: '기업규모', dbName: 'enterprise_size' }, //하위시트 참고 새롭게 추가
    { spName: '건강보험취득_사업장명', dbName: 'health_insurance_enterprise' },
  ],
  [
    //userOtherEmploymentStatus //하위시트 참고 새롭게 추가
    { spName: '취업_기타수집_data 취업일자', dbName: 'emplyment_date' },
    { spName: '사업장명', dbName: 'enterprise' },
  ],
  [
    //userEducationFundState
    {
      spName: '지원금 관리 총 지급 개월',
      dbName: 'total_payment_of_number',
    },
    { spName: '총 지급액', dbName: 'total_payment_of_money' },
    { spName: '지원만료일', dbName: 'payment_end_date' }, //하위시트 참고 새롭게 추가
    { spName: '지원만료', dbName: 'payment_ended' },
    { spName: '특이사항', dbName: 'remarks' },
  ],
  [
    //userComputationFund
    { spName: '지원금 산정 지급일', dbName: 'payment_date' }, //하위시트 참고 새롭게 추가
    { spName: '수령여부', dbName: 'received' }, //지급일 추가해야함
    { spName: '수령금액', dbName: 'recevied_amount' },
  ],
  [
    //userAccessCard
    { spName: '출입카드_info 사진이미지파일', dbName: 'profile_picture_path' },
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
    { spName: '기타정보 최종학력', dbName: 'highest_level_of_education' },
    { spName: '소프트웨어 관련전공여부', dbName: 'majored' },
    { spName: '전공명(복수전공기재)', dbName: 'major_name' },
  ],
  [
    //userLapiscineInformation
    { spName: 'La Piscine LaPiscine_기수', dbName: 'lapiscine_grade' },
    { spName: 'LaPiscine_차수', dbName: 'lapiscine_degree' },
    { spName: 'LaPiscine_참여이력', dbName: 'record_participate_lapiscine' },
    { spName: 'LaPiscine_final_score', dbName: 'lapiscine_final_score' },
  ],
  [
    //userLapiscineInformation
    { spName: 'La Piscine LaPiscine_기수', dbName: 'lapiscine_grade' },
    { spName: 'LaPiscine_차수', dbName: 'lapiscine_degree' },
    { spName: 'LaPiscine_참여이력', dbName: 'Record_participate_lapiscine' },
    { spName: 'LaPiscine_final_score', dbName: 'lapiscine_final_score' },
  ],
];

//테이블의 경계
export const endOfTable = [
  '학사정보 no.',
  '인적정보 지역',
  '과정연장 기본종료일자',
  '휴학 휴학',
  'BLACKHOLE Blackholed',
  '과정중단 과정중단',
  '학습데이터(API) Coalition Score',
  '로열티 관리 대상기간',
  '취업현황 취업현황',
  'HRD-Net 동의 정보제공동의',
  'HRD-Net_data HRD-Net_출력_date',
  '취업_기타수집_data 취업일자',
  '지원금 관리 총 지급 개월',
  '지원금 산정 지급일',
  '출입카드_info 사진이미지파일',
  '기타정보 최종학력',
  'La Piscine LaPiscine_기수',
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
    columns: mapObj[TABLENUM.USERACCESSCARD],
    table: TABLENUM.USERACCESSCARD,
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
  userPersonal: 'userPersonal',
  userCourseExtension: 'userCourseExtension',
  userLeaveOfAbsence: 'userLeaveOfAbsence',
  userBlackhole: 'userBlackhole',
  userInterruptionOfCourse: 'userInterruptionOfCourse',
  userLearningDataAPI: 'userLearningDataAPI',
  userLoyaltyManagement: 'userLoyaltyManagement',
  userEmploymentStatus: 'userEmploymentStatus',
  userHrdNetUtilizeConsent: 'userHrdNetUtilizeConsent',
  userHrdNetUtilize: 'userHrdNetUtilize',
  userOtherEmploymentStatus: 'userOtherEmploymentStatus',
  userEducationFundState: 'userEducationFundState',
  userComputationFund: 'userComputationFund',
  userAccessCard: 'userAccessCard',
  userOtherInformation: 'userOtherInformation',
  userLapiscineInformation: 'userLapiscineInformation',
};
