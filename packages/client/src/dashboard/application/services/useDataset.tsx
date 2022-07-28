import { DocumentNode, useQuery } from '@apollo/client';
import { FilterConfigType } from '../../presentation/components/Sticker/Filter.type';

export interface QueryVariablesType {
  [filterName: string]: FilterConfigType;
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
