import { DocumentNode } from '@apollo/client';

export interface chartProps {
  query: DocumentNode;
  filters: object;
}

export const chartColor = [
  '#72aee6',
  '#ff8085',
  '#f0c33c',
  '#1ed14b',
  '#2271b1',
  '#008a20',
];

export const options = {
  responsive: true,
  maintainAspectRatio: false,
};
