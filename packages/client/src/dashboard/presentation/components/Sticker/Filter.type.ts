import { useQuery } from '@apollo/client';

export type EntityNameType =
  | 'user'
  | 'userPersonalInformation'
  | 'userProcessProgress'
  | 'userLeaveOfAbsence'
  | 'userBlackhole'
  | 'userReasonOfBreak'
  | 'userOtherInformation'
  | 'userLapiscineInformation'
  | 'userEmploymentAndFound'
  | 'userHrdNetUtilize'
  | 'userEducationFundState'
  | 'userComputationFund'
  | 'userAccessCardInformation';

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

export default interface FilterConfigType {
  entityName: EntityNameType;
  column: ColumnType;
  operator: OperatorType;
  givenValue: GivenValueType;
}

export default interface FilterType {
  name: string;
  config: FilterConfigType;
}
