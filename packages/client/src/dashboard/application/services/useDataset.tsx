import { DocumentNode, useQuery } from '@apollo/client';

export interface QueryDataType {
  query: DocumentNode;
  filters: object;
}

function useChartDataset(queryData: QueryDataType) {
  const { query, filters } = queryData;

  const { data, loading, error } = useQuery(query, {
    variables: filters,
  });

  return { data, loading, error };
}

export default useChartDataset;
