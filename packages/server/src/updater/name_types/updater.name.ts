//테이블의 컬럼을 나열해 놓았습니다.
//컬럼 추가시 여기에 추가해야함

export const mapObj = [
  [
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
    { spName: '개인정보관리 지역', dbName: 'region' },
    { spName: '성별', dbName: 'gender' },
    { spName: '생년월일', dbName: 'birthday' },
    { spName: '만 나이', dbName: 'grade' }, //테이블에 없음
    { spName: '전화번호', dbName: 'phone_number' },
    { spName: '이메일', dbName: 'email' },
    //이메일, 전화번호는 api
  ],
  [
    { spName: '과정진행여부 기본종료일자', dbName: 'basic_expiration_date' },
    { spName: '과정연장신청', dbName: 'request_extension' },
    { spName: '최종 종료일', dbName: 'final_expiration_date' },
  ],
  [
    { spName: '휴학 총 휴학개월 수', dbName: 'intra_no' }, //테이블에 없음
    { spName: '시작일자', dbName: 'start_absence_date' },
    { spName: '종료일자', dbName: 'end_absence_date' },
    { spName: '복학일자', dbName: 'return_from_absence_date' },
    { spName: '사유', dbName: 'absence_reason' },
  ],
  [
    { spName: '잔여기간', dbName: 'remaining_period' },
    { spName: '블랙홀일자', dbName: 'blackhole_date' },
    { spName: '블랙홀 사유', dbName: 'reason_of_blackhole' },
    //잔여기간, 블랙홀일자는 api -> 추가함
  ],
  [
    { spName: '과정중단 과정중단일자', dbName: 'date_of_break' },
    { spName: '중단사유', dbName: 'reason_of_break' },
  ],
  [
    { spName: '기타정보 최종학력', dbName: 'highest_level_of_education' },
    { spName: '소프트웨어 관련전공여부', dbName: 'major' },
    { spName: '전공명(복수전공기재)', dbName: 'major_name' },
  ],
  [
    { spName: '라피신정보 관리 라피신 기수', dbName: 'lapiscine_grade' },
    { spName: '라피신 차수', dbName: 'lapiscine_degree' },
    { spName: '라피신 참여이력', dbName: 'participate_lapicin' },
  ],
  [
    { spName: '취창업지원관리 취업', dbName: 'employment' },
    { spName: '취업일자', dbName: 'employment_date' },
    { spName: '사업장명', dbName: 'enterprise' },
  ],
  [
    {
      spName: 'HRD-Net 활용 정보제공동의',
      dbName: 'consent_to_provide_information',
    },
  ],
  [
    {
      spName: '교육지원금 관리 총 산정월(미지급월포함)',
      dbName: 'total_payment_of_number',
    },
    { spName: '총 지급액', dbName: 'total_payment_of_money' },
    { spName: '잔여지원기간', dbName: 'remaining_period_of_fund' },
  ],
  [
    { spName: '지원금산정 지원금수령여부', dbName: 'received_fund' },
    { spName: '지원금수령금액', dbName: 'recevied_grant_amount' },
  ],
  [
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
];

//테이블의 경계

export const endOfTable = [
  '학사정보 no.',
  '개인정보관리 지역',
  '과정진행여부 기본종료일자',
  '휴학 총 휴학개월 수',
  '블랙홀 사유',
  '과정중단 과정중단일자',
  //'학습데이터',
  '기타정보 최종학력',
  '라피신정보 관리 라피신 기수',
  //'인턴현황',
  '취창업지원관리 취업',
  //'기타취업현황',
  'HRD-Net 활용 정보제공동의',
  '교육지원금 관리 총 산정월(미지급월포함)',
  '지원금산정 지원금수령여부',
  '출입카드정보 사진이미지파일',
];

export const apiOfTable = ['학습데이터'];
