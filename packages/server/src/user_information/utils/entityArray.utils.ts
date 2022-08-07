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
import { IsNull, Not, Raw } from 'typeorm';
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
  // UserEducationFundState,
  UserComputationFund,
  UserAccessCardInformation,
  UserOtherEmploymentStatus,
  UserLapiscineInformation,
];

// const valExColumnEntity = [
//   // User,
//   // UserPersonalInformation,
//   // UserCourseExtension,
//   UserLeaveOfAbsence,
//   // UserBlackhole,
//   // UserInterruptionOfCourse,
//   // UserLearningDataAPI,
//   // UserLoyaltyManagement,
//   // UserEmploymentStatus,
//   // UserHrdNetUtilize,
//   // UserHrdNetUtilizeConsent,
//   // UserOtherEmploymentStatus,
//   // UserEducationFundState,
//   // UserComputationFund,
//   // UserAccessCardInformation,
//   // UserOtherEmploymentStatus,
//   // UserLapiscineInformation,
// ];

const valExColumnEntity = [
  'user',
  'userPersonalInformation',
  'userCourseExtension',
  'userLeaveOfAbsence',
  'userBlackhole',
  'userInterruptionOfCourse',
  'userLearningDataAPI',
  'userLoyaltyManagement',
  'userEmploymentStatus',
  'userHrdNetUtilize',
  'userHrdNetUtilizeConsent',
  'userOtherEmploymentStatus',
  // 'userEducationFundState',
  'userComputationFund',
  'userAccessCardInformation',
  'userOtherEmploymentStatus',
  'userLapiscineInformation',
];

// 프론트에서 할수 있는건 프론트에서 처리하게끔 하자
const entityColumnNotMapping = {
  userEducationFundState: {
    // 기간 필터링 적용 X
    // validate_date: 'validate_date',
    // expired_date: 'expired_date',
  },
  userAccessCardInformation: {
    // 기간 필터링 적용 X
    // 사용 불가능
    // validate_date: 'validate_date',
    // expired_date: 'expired_date',
  },
  userLapiscineInformation: {
    // 기간 필터링 적용 X
    // 사용 불가능
    // validate_date: 'validate_date',
    // expired_date: 'expired_date',
  },
  userOtherInformation: {
    // 기간 필터링 적용 X
    // 사용 불가능
    // validate_date: 'validate_date',
    // expired_date: 'expired_date',
  },
  userPersonalInformation: {
    // 기간 필터링 적용 X
    // 사용 불가능
    // validate_date: 'validate_date',
    // expired_date: 'expired_date',
  },
  userLoyaltyManagement: {
    // 그냥 얘 컬럼은 안보여줘도 되고 신경쓸 필요도 없을듯
    // 사용 불가능 -> 대신 컬럼이름을 공개
    // 대상기간을 분기날짜로 저장하는 컬럼으로 해야함 -> 확인 및 변경
    // validate_date: ['royalty_period'],
    // expired_date: 'expired_date',
  },
  userCourseExtension: {
    // 기간 필터링 적용 X
    // 사용 불가능. 대신 basic_expiration_date 컬럼과 final_expiration_date 컬럼을 공개
    // -> 프론트에게 요청
    validate_date: ['basic_expiration_date', 'final_expiration_date'],
    // expired_date: 'expired_date',
  },
  userComputationFund: {
    // 사용 불가능. 대신 컬럼이름을 공개.
    // -> 프론트에게 요청
    validate_date: ['payment_date'],
    // expired_date: 'payment_date',
  },
  userBlackhole: {
    // 사용 불가능. 대신 컬럼이름을 공개.
    // -> 프론트에게 요청
    validate_date: ['blackhole_date'],
    // expired_date: 'expired_date',
  },
  userInterruptionOfCourse: {
    // 사용 불가능. 대신 컬럼이름을 공개.
    // -> 프론트에게 요청
    validate_date: ['break_date'],
    // expired_date: 'expired_date',
  },
  userLearningDataAPI: {
    // ************************************************
    // 얘만 프론트에 요청해서 알럴트 띄울수 있게 해주기.
    // ************************************************
    // 아래 날짜는 실제 42 DB 업데이트 날짜가 아니라 루나님이 확인한 날짜임
    // 근데, 웬만하면 실제 42 DB 업데이나 날짜와 차이가 없을듯...
    // 사용 불가능 -> 대신 컬럼이름을 공개
    // 4개의 날짜 컬럼이 존재 -> 확인
    // 얘는 expired_date 없으면 안되는데...? -> 어짜피 달 단위로 할꺼기때문에 expried_date 없어도 될듯
    validate_date: [
      'scored_date',
      'circled_date',
      'leveled_date',
      'outcircled_date',
    ],
    // expired_date: 'expired_date',
  },
  userHrdNetUtilize: {
    // 사용 불가능 -> 대신 컬럼이름을 공개
    // 보류(나중에 루나님께 여쭤보기)
    validate_date: ['hrd_net_date', 'employment_insurance_date'],
    // expired_date: 'hrd_net_date',
  },
  // 얘랑 userEmploymentStatus 테이블이랑 연관관계 있음
  userHrdNetUtilizeConsent: {
    // 사용 불가능 -> 대신 컬럼이름을 공개
    // validate_date를 정보제공동의 일자로 -> 확인 및 변경
    validate_date: ['consented_date'],
    // expired_date: 'expired_date',
  },
};

// ************************************************
// expired_date에 값을 어떻게 저장해 주는지를 모르고 있는 상황
// ************************************************

///////////////////////////////////////////////////
const halfAndHalf = {
  user: {
    // 얘는 항상 누적
    // 사용 불가능. 대신 start_process_date 컬럼을 공개
    // 아래 entityColumnMapping로 옮겨야한다. 특정기간, 특정시점 현황판을 위해선...
    validate_date: 'start_process_date',
    // expired_date: 'expired_date',
  },
  userOtherEmploymentStatus: {
    // 기간 필터링 적용 X
    // 기간 필터링 적용 O
    // 사용 불가능. 대신 컬럼이름을 공개.
    // -> 프론트에게 요청
    validate_date: 'employment_date',
    // expired_date: 'expired_date',
  },
};

///////////////////////////////////////////////////

const entityColumnMapping = {
  userLeaveOfAbsence: {
    validate_date: 'begin_absence_date',
    expired_date: 'end_absence_date',
  },
  // 얘랑 userOtherEmploymentStatus 테이블이랑 연관관계 있음
  userEmploymentStatus: {
    // ************************************************
    // <- 이 엔터티에서 문제가 발생 <- 어디가 문제인지를 모르겠음
    // ************************************************
    // 기간 필터링 적용 O
    // 사용 불가능. 대신 컬럼이름을 공개.
    // 얘는 expired_date 없으면 안되는데...? -> 근거가 명확해야함
    validate_date: 'employment_date',
    expired_date: 'expired_date', // <- 얘 값이 문제일듯?
  },
};

function getValidateColumn(entityName, column) {
  const columns = ['coalition_score', 'circle', 'level', 'outcircle'];
  if (entityName == 'userLearningDataAPI' && column in columns) {
    const index = columns.indexOf(column);
    return entityColumnNotMapping[entityName]['validate_date'][index];
  } else if (entityName == 'userLearningDataAPI')
    return entityColumnMapping[entityName]['validate_date'][column];
  else if (entityName == 'user' || entityName == 'userOtherEmploymentStatus') {
    return halfAndHalf[entityName]['validate_date'];
  } else {
    return entityColumnMapping[entityName]['validate_date'];
  }
}

function getExpireColumn(entityName, column = null) {
  return entityColumnMapping[entityName]['validate_date'];
}

function getRawQuery(refDate) {
  // if (entityName in entityColumnNotMapping) return Not(IsNull()); <- 필요없는 조건문
  return Raw((alias) => `${alias} <= :refDate AND ${alias} < :infinite`, {
    refDate: refDate,
    infinite: new Date('9999-12-21'),
  });
}

function exceptCase(entityName, column) {
  const columns = ['coalition_score', 'circle', 'level', 'outcircle'];
  if (entityName == 'userLearningDataAPI' && column in columns) {
    return true;
  } else return false;
}

export {
  NonValExColumnEntity,
  valExColumnEntity,
  entityColumnMapping,
  entityColumnNotMapping,
  halfAndHalf,
  getValidateColumn,
  getRawQuery,
  getExpireColumn,
  exceptCase,
};
