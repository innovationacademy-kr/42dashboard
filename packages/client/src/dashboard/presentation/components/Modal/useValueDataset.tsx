import { useQuery } from '@apollo/client';
import createValueQuery from '../../../infrastructure/http/graphql/createValueQuery';

function useValueDataset(entityName: string, column: string) {
  const { data, loading, error } = useQuery(
    createValueQuery(entityName, column),
  );

  return { data, loading, error };
}

export default useValueDataset;
