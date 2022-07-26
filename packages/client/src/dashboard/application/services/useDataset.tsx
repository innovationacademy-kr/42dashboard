import { DocumentNode, useQuery } from '@apollo/client';
import {
  ColumnType,
  EntityNameType,
  GivenValueType,
  OperatorType,
} from '../../presentation/components/Sticker/Filter.type';

export interface QueryFilterType {
  entityName: EntityNameType | string;
  column: ColumnType;
  operator: OperatorType;
  givenValue: GivenValueType;
  latest: boolean;
}

export interface QueryVariablesType {
  [filterName: string]: QueryFilterType;
}

export interface QueryDataType {
  query: DocumentNode;
  filters: QueryVariablesType;
}

function useChartDataset(queryData: QueryDataType) {
  const { query, filters } = queryData;

  const { data, loading, error } = useQuery(query, {
    variables: filters,
  });

  return { data, loading, error };
}

export default useChartDataset;
