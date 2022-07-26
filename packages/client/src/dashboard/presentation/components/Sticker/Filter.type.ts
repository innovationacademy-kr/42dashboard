export type EntityNameType =
  | 'User'
  | 'UserPersonalInformation'
  | 'UserProcessProgress'
  | 'UserLeaveOfAbsence'
  | 'UserBlackhole'
  | 'UserReasonOfBreak'
  | 'UserOtherInformation'
  | 'UserLapiscineInformation'
  | 'UserEmploymentAndFound'
  | 'UserHrdNetUtilize'
  | 'UserEducationFundState'
  | 'UserComputationFund'
  | 'UserAccessCardInformation';

export type ColumnType = string;

// interface Column {
// 	User : {
// 		intra_no: number;
// 		intra_id: number;
// 		name: string;
// 		grade: number;
// 		start_process: timestamp;
// 		coalition;
// 		academic_state;

// 	}
// 	UserPersonalInformation
// }

export type OperatorType =
  | '='
  | '!='
  | '<'
  | '<='
  | '>'
  | '>='
  | 'in'
  | 'between'
  | 'like'
  | 'ilike';

export type GivenValueType = any; // 이후 모든 필드의 데이터 타입이 정해진다면 타입정의 가능

export interface FilterConfigType {
  entityName: EntityNameType;
  column: ColumnType;
  operator: OperatorType;
  givenValue: GivenValueType;
}

export interface FilterType {
  name: string;
  config: FilterConfigType;
}
