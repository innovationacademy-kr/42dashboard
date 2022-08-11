export interface ErrorMsg {
  colIdx: string;
  value: string;
  rowIdx: number;
  message?: string;
}

export const excelErrorList = [
  '#REF!',
  '#ERROR!',
  '#N/A',
  '#NAME?',
  '#VALUE!',
  '#N/A',
  'DIV/0!',
  '#NULL!',
  '#NUM!',
];

export function formatError(repoName, contents, errorMsg) {
  return `[Sheet] ${repoName}\n[Contents] ${contents}\n[Index] \'${errorMsg.colIdx}:${errorMsg.rowIdx}\'의 '${errorMsg.value}' 값을 수정해주세요.`;
}

export function formatErrorMain(repoName, contents) {
  return `[Sheet] ${repoName}\n[Contents] ${contents}\n`;
}

export const enum ERRORMSG {
  COLUMNS = '컬럼의 이름이 변경되었거나, 수가 변동되었습니다.',
  DUPLICATE = '기본키의 값이 중복되었습니다.',
  INTERRUPT = '수정불가능한 값이 변동되었습니다',
  CHANGED = '최신 데이터가 수정되었습니다.',
  INSERT = '삽입된 데이터의 날짜와 형식을 확인해주세요',
  UPDATE = '갱신된 데이터의 날짜와 형식을 확인해주세요',
  SUCCESS = '수정된 데이터가 성공적으로 저장되었습니다.',
  NULL = '공백이 들어갈 수 없는 항목에 빈 값이 들어갔습니다.',
  DISAPPEARED = '저장하던 시트가 누락되었습니다. \n다시 수정하기를 눌러주세요.',
  DUPPROCESS = 'intra No의 수정, 삭제 작업이 동시에 일어났습니다. 작업을 분리해주세요',
  CHANGEDTABLE = '구글 스프레드 시트의 테이블값이 수정되었습니다. 정해진 테이블으로 되돌려주세요',
  NONCALCULATE = '구글 스프레드 시트에 계산되지 않은 값들이 있습니다. 확인해주세요',
  TOMANYWORK = '기본키를 수정을 한번에 너무 많이 시도하였습니다.',
}
