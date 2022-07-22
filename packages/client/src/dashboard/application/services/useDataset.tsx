import { DocumentNode, useQuery } from '@apollo/client';

export interface QueryFilterType {
  entityName: string;
  column: string;
  operator: string;
  givenValue: string;
  latest: boolean;
}

export interface QueryDataType {
  query: DocumentNode; // createQuery()
  filters: {
    [filterName: string]: QueryFilterType;
  };
}

function useChartDataset(queryData: QueryDataType) {
  const { query, filters } = queryData;

  const { data, loading, error } = useQuery(query, {
    variables: filters,
  });

  return { data, loading, error };
}

export default useChartDataset;
