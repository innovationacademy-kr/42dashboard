//테이블의 컬럼을 나열해 놓았습니다.
//컬럼 추가시 여기에 추가해야함

import {
  SPREAD_END_POINT,
  SUB_C_ID1,
  SUB_C_ID2,
  SUB_C_ID3,
  SUB_C_ID4,
  SUB_C_ID5,
  SUB_T_ID1,
  SUB_T_ID2,
  SUB_T_ID3,
  SUB_T_ID4,
  SUB_T_ID5,
  SUB_T_ID6,
  SUB_T_ID7,
  SUB_T_ID8,
} from 'src/config/key';

export const enum TABLENUM {
  USER = 0,
  USERPERSONAL = 1,
  USERPROCESSPROGRESS = 2,
  USERLEAVEOFABSENCE = 3,
  USERBLACKHOLE = 4,
  USERREASONOFBREAK = 5,
  USEROTHERINFORMATION = 6,
  USERLAPISCINEINFORMATION = 7,
  USERINTERNSTATUS = 8,
  USEREMPLOYMENTANDFOUND = 9,
  USEREMPLOYMENTSTATUS = 10,
  USERHRDNETUTILIZE = 11,
  USEREDUCATIONFUNDSTATE = 12,
  USERCOMPUTATIONFUND = 13,
  USERACCESSCARD = 14,
  USERLEARNINGDATA = 15,
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
    { spName: '학적', dbName: 'academic_state' },
    { spName: '특이사항', dbName: 'uniqueness' }, //테이블에 없음
  ],
  [
    //userpersonal
    { spName: '개인정보관리 지역', dbName: 'region' },
    { spName: '성별', dbName: 'gender' },
    { spName: '생년월일', dbName: 'birthday' },
    { spName: '만 나이', dbName: 'grade' }, //테이블에 없음
    { spName: '전화번호', dbName: 'phone_number' },
    { spName: '이메일', dbName: 'email' },
    //이메일, 전화번호는 api
  ],
  [
    //userProcessProgress
    { spName: '과정진행여부 기본종료일자', dbName: 'basic_expiration_date' },
    { spName: '과정연장신청', dbName: 'request_extension' },
    { spName: '최종 종료일', dbName: 'final_expiration_date' },
  ],
  [
    //userLeaveOfAbsence (+ 휴학기간)
    { spName: '휴학 총 휴학개월 수', dbName: 'intra_no' }, //테이블에 없음
    { spName: '시작일자', dbName: 'start_absence_date' },
    { spName: '종료일자', dbName: 'end_absence_date' },
    { spName: '복학일자', dbName: 'return_from_absence_date' },
    { spName: '사유', dbName: 'absence_reason' },
  ],
  [
    //userBlackhole
    { spName: '잔여기간', dbName: 'remaining_period' },
    { spName: '블랙홀일자', dbName: 'blackhole_date' },
    { spName: '블랙홀 사유', dbName: 'reason_of_blackhole' },
    //잔여기간, 블랙홀일자는 api -> 추가함
  ],
  [
    //userReasonOfBreak
    { spName: '과정중단 과정중단일자', dbName: 'date_of_break' },
    { spName: '중단사유', dbName: 'reason_of_break' },
  ],
  [
    // userOtherRepository
    { spName: '기타정보 최종학력', dbName: 'highest_level_of_education' },
    { spName: '소프트웨어 관련전공여부', dbName: 'major' },
    { spName: '전공명(복수전공기재)', dbName: 'major_name' },
  ],
  [
    //userLapiscineInformation
    { spName: '라피신정보 관리 라피신 기수', dbName: 'lapiscine_grade' },
    { spName: '라피신 차수', dbName: 'lapiscine_degree' },
    { spName: '라피신 참여이력', dbName: 'participate_lapicin' },
  ],
  [
    //userInternStatus //하위시트 참고 새롭게 추가
    { spName: '인턴시작일자', dbName: 'start_intern_date' },
    { spName: '인턴종료일자', dbName: 'end_intern_date' },
    { spName: '인턴참여회사', dbName: 'enterprise' },
    { spName: '인턴직무', dbName: 'intern_part_of_job' },
    { spName: '인턴관련블랙홀지급여부', dbName: 'is_given_blackhole' },
    { spName: '인턴관련블랙홀지급일수', dbName: 'given_blackhole_day' },
    { spName: '인턴관련비고', dbName: 'intern_note' },
  ],
  [
    //userEmploymentAndFound
    { spName: '취창업지원관리 취업', dbName: 'employment' }, //하위시트에서 고민중 구글시트에 없음.
    { spName: '취업일자', dbName: 'employment_date' },
    { spName: '사업장명', dbName: 'enterprise' },
    {
      spName: 'HRD사용 여부',
      dbName: 'consent_to_provide_information', //하위시트 참고 새롭게 추가
    },
  ],
  [
    //userEmploymentStatus //하위시트 참고 새롭게 추가
    { spName: '고용보험가입일', dbName: 'emplyment_date' },
    { spName: '기업규모', dbName: 'enterprise_size' },
    { spName: '사업장명', dbName: 'enterprise' },
  ],
  [
    //userHrdNetUtilize
    {
      spName: 'HRD-Net 활용 정보제공동의',
      dbName: 'consent_to_provide_information', //하위시트 참고 삭제고려
    }, //제거해야할 수도
    { spName: '취업여부', dbName: 'employment' }, //하위시트 참고 새롭게 추가
    { spName: '고용보험가입일', dbName: 'employment_insurance_date' }, //하위시트 참고 새롭게 추가
    { spName: '기업규모', dbName: 'enterprise_size' }, //하위시트 참고 새롭게 추가
    { spName: '사업장명', dbName: 'enterprise' }, //하위시트 참고 새롭게 추가
  ],
  [
    //userEducationFundState
    {
      spName: '교육지원금 관리 총 산정월(미지급월포함)',
      dbName: 'total_payment_of_number',
    }, //구글 하위 시트에 과정시작일이 있으나 중복이어서 추가하지 않음.
    { spName: '총 지급액', dbName: 'total_payment_of_money' },
    { spName: '지원금지급시작일자', dbName: 'payment_give_start_date' }, //하위시트 참고 새롭게 추가
    { spName: '지원금유예기간', dbName: 'payment_delay_period' }, //하위시트 참고 새롭게 추가
    { spName: '지원자지급종료일자', dbName: 'payment_end_date' }, //하위시트 참고 새롭게 추가
    { spName: '잔여지원기간', dbName: 'remaining_period_of_fund' }, //하위시트 참고 새롭게 추가
  ],
  [
    //userComputationFund
    { spName: '지원금산정 지원금수령여부', dbName: 'is_received_fund' }, //지급일 추가해야함
    { spName: '지원금수령금액', dbName: 'recevied_amount' },
    { spName: '지급일', dbName: 'payment_date' }, //하위시트 참고 새롭게 추가
  ],
  [
    //userAccessCardRepository
    { spName: '출입카드정보 사진이미지파일', dbName: 'profile_picture_url' },
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
    {
      spName: '서클',
      dbName: 'circle',
    },
    {
      spName: '서클일자',
      dbName: 'circle_date',
    },
    {
      spName: '레벨',
      dbName: 'level',
    },
    {
      spName: '레벨일자',
      dbName: 'level_date',
    },
  ],
];

//테이블의 경계

export const endOfTable = [
  //메인2
  '학사정보 no.',
  '개인정보관리 지역',
  '과정진행여부 기본종료일자',
  '휴학 총 휴학개월 수',
  '블랙홀 사유',
  '과정중단 과정중단일자',
  '기타정보 최종학력',
  '라피신정보 관리 라피신 기수',
  '인턴현황',
  '취창업지원관리 취업',
  '기타취업현황',
  'HRD-Net 활용 정보제공동의',
  '교육지원금 관리 총 산정월(미지급월포함)',
  '지원금산정 지원금수령여부',
  '출입카드정보 사진이미지파일',
  '학습데이터',
];

export const pastDataOnSheet = [
  //하위1
  {
    //유저
    endPoint: null,
    Id: null,
    columns: mapObj[TABLENUM.USER],
    table: TABLENUM.USER,
  },
  {
    //개인정보
    endPoint: null,
    Id: null,
    columns: mapObj[TABLENUM.USERPERSONAL],
    table: TABLENUM.USERPERSONAL,
  },
  {
    //과정진행여부
    endPoint: null,
    Id: null,
    columns: mapObj[TABLENUM.USERPROCESSPROGRESS],
    table: TABLENUM.USERPROCESSPROGRESS,
  },
  {
    // 휴학
    endPoint: SPREAD_END_POINT,
    Id: SUB_T_ID1,
    columns: mapObj[TABLENUM.USERLEAVEOFABSENCE],
    table: TABLENUM.USERLEAVEOFABSENCE,
  },
  {
    // 블랙홀
    endPoint: SPREAD_END_POINT,
    Id: SUB_T_ID2,
    columns: mapObj[TABLENUM.USERBLACKHOLE],
    table: TABLENUM.USERBLACKHOLE,
  },
  {
    // 과정중단
    endPoint: SPREAD_END_POINT,
    Id: SUB_T_ID3,
    columns: mapObj[TABLENUM.USERREASONOFBREAK],
    table: TABLENUM.USERREASONOFBREAK,
  },
  {
    //기타정보
    endPoint: null,
    Id: null,
    columns: mapObj[TABLENUM.USEROTHERINFORMATION],
    table: TABLENUM.USEROTHERINFORMATION,
  },
  {
    //라피신정보
    endPoint: null,
    Id: null,
    columns: mapObj[TABLENUM.USERLAPISCINEINFORMATION],
    table: TABLENUM.USERLAPISCINEINFORMATION,
  },
  {
    // 인턴정보 //취업창업지원관리 시트와 겹침
    endPoint: SPREAD_END_POINT,
    Id: SUB_T_ID6,
    columns: mapObj[TABLENUM.USERINTERNSTATUS],
    table: TABLENUM.USERINTERNSTATUS,
  },
  {
    // 취창업지원관리
    endPoint: SPREAD_END_POINT,
    Id: SUB_T_ID4,
    columns: mapObj[TABLENUM.USEREMPLOYMENTANDFOUND],
    table: TABLENUM.USEREMPLOYMENTANDFOUND,
  },
  {
    //기타취업
    endPoint: SPREAD_END_POINT,
    Id: SUB_T_ID5,
    columns: mapObj[TABLENUM.USEREMPLOYMENTSTATUS],
    table: TABLENUM.USEREMPLOYMENTSTATUS,
  },
  {
    // HRD고용보험
    endPoint: SPREAD_END_POINT,
    Id: SUB_T_ID7,
    columns: mapObj[TABLENUM.USERHRDNETUTILIZE],
    table: TABLENUM.USERHRDNETUTILIZE,
  },
  {
    // 교육지원금관리
    endPoint: SPREAD_END_POINT,
    Id: SUB_T_ID8,
    columns: mapObj[TABLENUM.USEREDUCATIONFUNDSTATE],
    table: TABLENUM.USEREDUCATIONFUNDSTATE,
  },
  {
    // 지원금산정
    endPoint: null,
    Id: null,
    columns: mapObj[TABLENUM.USERCOMPUTATIONFUND],
    table: TABLENUM.USERCOMPUTATIONFUND,
  },
  {
    // 출입카드정보
    endPoint: null,
    Id: null,
    columns: mapObj[TABLENUM.USERACCESSCARD],
    table: TABLENUM.USERACCESSCARD,
  },
  {
    // 학습데이터(api)
    endPoint: null,
    Id: null,
    columns: mapObj[TABLENUM.USERLEARNINGDATA],
    table: TABLENUM.USERLEARNINGDATA,
  },
];

export const pastDataOnColumn = [
  //하위컬럼1
  {
    endPoint: SPREAD_END_POINT,
    Id: [SUB_C_ID1, SUB_C_ID2, SUB_C_ID3],
    table: TABLENUM.USERCOMPUTATIONFUND,
  },
  {
    endPoint: SPREAD_END_POINT,
    Id: [SUB_C_ID4, SUB_C_ID5],
    table: TABLENUM.USERLEARNINGDATA,
  },
];

export const apiOfTable = ['학습데이터'];
