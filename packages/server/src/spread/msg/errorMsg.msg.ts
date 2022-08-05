export interface ErrorMsg {
  colIdx: string;
  value: string;
  rowIdx: number;
}

export function formatError(repoName, contents, errorMsg) {
  return `[Sheet] ${repoName}\n[Contents] ${contents}\n[Index] \'${errorMsg.colIdx}:${errorMsg.rowIdx}\'의 '${errorMsg.value}' 값을 수정해주세요.`;
}

export const enum ERRORMSG {
  COLUMNS = '컬럼의 이름이 변경되었거나, 수가 변동되었습니다.',
  DUPLICATE = '기본키의 값이 중복되었습니다.',
  INTERRUPT = '기존 데이터베이스의 값이 변동되었습니다',
  CHANGED = '최신 데이터가 수정되었습니다.',
  INSERT = '삽입된 데이터의 날짜와 형식을 확인해주세요',
  UPDATE = '갱신된 데이터의 날짜와 형식을 확인해주세요',
  SUCCESS = '수정된 데이터가 성공적으로 저장되었습니다.',
}
