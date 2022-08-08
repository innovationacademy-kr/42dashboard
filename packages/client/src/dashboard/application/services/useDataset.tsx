import { DocumentNode, useQuery } from '@apollo/client';
import createQueryForChart, {
  createBachelorQuery,
  createQueryForTable,
} from '../../infrastructure/http/graphql/createQuery';
import { FilterConfigType } from '../../presentation/components/Sticker/Filter.type';
import { StickerContentType } from '../../presentation/components/Sticker/StickerContent.type';

export interface QueryVariablesType {
  [filterName: string]: FilterConfigType;
}

export interface ChartQueryIngredientType {
  filterNames: string[];
  labels: string[];
  filterSetsPerData: string[][];
  startDate?: Date;
  endDate?: Date;
}

export interface TableQueryIngredientType {
  filterNames: string[];
  fields: (string | object)[];
  startDate?: Date;
  endDate?: Date;
  skip?: number;
  take?: number;
}

export interface BachelorQueryIngredientType {
  filterNames: string[];
}

export type QueryIngredientType =
  | ChartQueryIngredientType
  | TableQueryIngredientType
  | BachelorQueryIngredientType;

export interface QueryDataType {
  stickerContentType: StickerContentType;
  queryIngredient: QueryIngredientType;
  filters: QueryVariablesType;
}

function useGqlQuery(queryData: QueryDataType) {
  const { stickerContentType, queryIngredient, filters } = queryData;
  let query: DocumentNode;
  if (
    stickerContentType === 'pieChart' ||
    stickerContentType === 'barChart' ||
    stickerContentType === 'lineChart'
  ) {
    const {
      filterNames,
      filterSetsPerData,
      labels,
      endDate,
      startDate,
    }: ChartQueryIngredientType = queryIngredient as ChartQueryIngredientType;
    query = createQueryForChart(
      filterNames,
      labels,
      filterSetsPerData,
      endDate,
      startDate,
    );
  } else if (stickerContentType === 'table') {
    const {
      filterNames,
      fields,
      startDate,
      endDate,
      skip,
      take,
    }: TableQueryIngredientType = queryIngredient as TableQueryIngredientType;
    query = createQueryForTable(
      filterNames,
      fields,
      startDate,
      endDate,
      skip,
      take,
    );
  } else if (stickerContentType === 'bachelor') {
    const { filterNames }: BachelorQueryIngredientType =
      queryIngredient as BachelorQueryIngredientType;
    query = createBachelorQuery(filterNames);
  } else {
    throw new Error('쿼리를 사용할 수 없는 스티커 타입입니다.');
  }

  const { data, loading, error } = useQuery(query, {
    variables: filters,
  });

  return { data, loading, error };
}

export default useGqlQuery;
