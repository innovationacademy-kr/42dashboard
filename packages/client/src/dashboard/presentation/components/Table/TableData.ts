export interface Column {
  id: 'intra_no' | 'intra_id' | 'name' | 'academic_state' | 'coalition';
  label: string;
  minWidth?: number;
  align?: 'right';
}

export const columns: readonly Column[] = [
  { id: 'intra_no', label: '인트라 숫자', minWidth: 170 },
  { id: 'intra_id', label: '인트라 아이디', minWidth: 170 },
  { id: 'name', label: '이름', minWidth: 170 },
  {
    id: 'academic_state',
    label: '학적',
    minWidth: 100,
  },
  {
    id: 'coalition',
    label: '코알리시옹',
    minWidth: 100,
  },
];
