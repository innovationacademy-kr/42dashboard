export const EntityColumn = {
  user: [
    //user
    { spName: 'Intra No.', dbName: 'intra_no' },
    { spName: 'Intra ID', dbName: 'intra_id' },
    { spName: '성명', dbName: 'name' },
    { spName: '기수', dbName: 'grade' },
    { spName: '과정시작', dbName: 'start_process' },
    { spName: '코알리숑', dbName: 'coalition' },
    { spName: '학적', dbName: 'academic_state' }, //[api]
    { spName: '특이사항', dbName: 'uniqueness' },
    { spName: '익명화', dbName: 'anonymization' },
  ],
  userPersonalInformation: [
    //userPersonalInformation
    { spName: '인적정보 지역', dbName: 'region' },
    { spName: '성별', dbName: 'gender' },
    { spName: '생년월일', dbName: 'birthday' },
    { spName: '키값', dbName: 'social_security_key' },
    { spName: '만 나이', dbName: 'age' },
    { spName: '휴대폰', dbName: 'phone_number' }, // [api]
    { spName: '이메일', dbName: 'email' }, // [api]
    //이메일, 전화번호는 api
  ],
  userCourseExtension: [
    // userCourseExtension
    { spName: '과정연장 기본종료일자', dbName: 'basic_expiration_date' },
    { spName: '과정연장', dbName: 'request_extension' },
    { spName: '최종 종료일', dbName: 'final_expiration_date' },
    { spName: '과정연장_level', dbName: 'extension_level' },
    { spName: '과정연장_circle', dbName: 'extension_circle' },
  ],
  userLeaveOfAbsence: [
    // userLeaveOfAbsence
    { spName: '휴학 휴학', dbName: 'absenced' },
    { spName: '휴학_begin_date', dbName: 'begin_absence_date' },
    { spName: '휴학_end_date', dbName: 'end_absence_date' },
    { spName: '복학_date', dbName: 'return_from_absence_date' },
    { spName: '휴학_reason', dbName: 'absence_reason' },
    { spName: 'AGU_reason', dbName: 'AGU_reason' },
    { spName: '기타', dbName: 'remarks' },
  ],
  userBlackhole: [
    // userBlackhole
    { spName: 'BLACKHOLE Blackholed', dbName: 'blackholed' },
    { spName: 'Blackholed_date', dbName: 'blackhole_date' },
    { spName: '사유', dbName: 'reason_of_blackhole' },
    { spName: 'Blackholed_level', dbName: 'blackholed_level' },
    { spName: '비고', dbName: 'remarks' },
    //잔여기간, 블랙홀일자는 api -> 추가함
  ],
  userInterruptionOfCourse: [
    // userInterruptionOfCourse
    { spName: '과정중단 과정중단', dbName: 'breaked' },
    { spName: '과정중단 과정중단일자', dbName: 'date_of_break' },
    { spName: '사유', dbName: 'reason_of_break' },
    { spName: 'HRD-Net 중도탈락 처리', dbName: 'HRD_Net_drop_out' },
  ],
  userLearningDataAPI: [
    // userLearningDataAPI
    { spName: '학습데이터(API) Coalition Score', dbName: 'coalition_score' },
    { spName: 'Scored_date', dbName: 'scored_date' },
    { spName: 'CIRCLE', dbName: 'circle' },
    { spName: 'CIRCLED_date', dbName: 'circled_date' },
    { spName: 'Level', dbName: 'level' }, // [api]
    { spName: 'Leveled_date', dbName: 'leveled_date' }, // [api]
    { spName: 'OUTCIRCLE', dbName: 'outcircle' },
    { spName: 'OUTCIRCLED_date', dbName: 'outcircled_date' },
  ],
  userLoyaltyManagement: [
    //userLoyaltyManagement
    { spName: '로열티 관리 대상기간', dbName: 'royalty_period' },
    { spName: '대상유무', dbName: 'royalty_presence' },
    { spName: '서클(대상기간기준)', dbName: 'royalty_circle' },
  ],
  userEmploymentStatus: [
    //userEmploymentStatus
    { spName: '취업현황 취업현황', dbName: 'employmented' },
    { spName: '취업일자', dbName: 'employment_date' },
    { spName: '사업장명', dbName: 'enterprise' },
  ],
  userHrdNetUtilizeConsent: [
    //userHrdNetUtilizeConsent
    {
      spName: 'HRD-Net 동의 정보제공동의',
      dbName: 'consent_to_provide_information',
    },
    { spName: '정보제공동의_일자', dbName: 'consented_date' },
  ],
  userHrdNetUtilize: [
    //userHrdNetUtilize
    { spName: 'HRD-Net_data HRD-Net_출력_date', dbName: 'hrd_net_date' },
    { spName: '취업여부', dbName: 'employmented' },
    { spName: '취업_사업자등록번호', dbName: 'business_registration_number' },
    { spName: '고용보험가입일', dbName: 'employment_insurance_date' },
    { spName: '기업규모', dbName: 'enterprise_size' },
    { spName: '건강보험취득_사업장명', dbName: 'health_insurance_enterprise' },
  ],
  userOtherEmploymentStatus: [
    //userOtherEmploymentStatus
    { spName: '취업_기타수집_data 취업일자', dbName: 'emplyment_date' },
    { spName: '사업장명', dbName: 'enterprise' },
  ],
  userEducationFundState: [
    //userEducationFundState
    {
      spName: '지원금 관리 총 지급 개월',
      dbName: 'total_payment_of_number',
    },
    { spName: '총 지급액', dbName: 'total_payment_of_money' },
    { spName: '지원만료일', dbName: 'payment_end_date' },
    { spName: '지원만료', dbName: 'payment_ended' },
    { spName: '특이사항', dbName: 'remarks' },
  ],
  userComputationFund: [
    //userComputationFund
    { spName: '지원금 산정 지급일', dbName: 'payment_date' },
    { spName: '수령여부', dbName: 'received' },
    { spName: '수령금액', dbName: 'recevied_amount' },
  ],
  userAccessCardInformation: [
    //userAccessCardInformation
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
  userOtherInformation: [
    // userOtherInformation
    { spName: '기타정보 최종학력', dbName: 'highest_level_of_education' },
    { spName: '소프트웨어 관련전공여부', dbName: 'majored' },
    { spName: '전공명(복수전공기재)', dbName: 'major_name' },
  ],
  userLapiscineInformation: [
    //userLapiscineInformation
    { spName: 'La Piscine LaPiscine_기수', dbName: 'lapiscine_grade' },
    { spName: 'LaPiscine_차수', dbName: 'lapiscine_degree' },
    { spName: 'LaPiscine_참여이력', dbName: 'record_participate_lapiscine' },
    { spName: 'LaPiscine_final_score', dbName: 'lapiscine_final_score' },
  ],
};
