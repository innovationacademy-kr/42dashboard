import StickerDataType from '../../../domain/stickerDatas/stickerData.type';
import createQuery from '../../../infrastructure/http/graphql/createQuery';
import { v4 as uuid } from 'uuid';
import {
  QueryDataType,
  QueryVariablesType,
} from '../../../application/services/useDataset';
import { DocumentNode } from '@apollo/client';
import { StickerContentType } from '../Sticker/StickerContent.type';
import { FilterConfigType } from '../Sticker/Filter.type';
import DEFAULT_TABLE_PROPS from '../../../application/utils/DEFAULT_TABLE_PROPS';

function stringToUnicode(str: string): string {
  let ret = '';
  for (let i = 0; i < str.length; i++) {
    ret += str.charCodeAt(i);
  }
  return ret;
}

function returnFilterName(filter: FilterConfigType): string {
  return `${filter.entityName}${filter.column}${
    filter.operator && stringToUnicode(filter.operator)
  }${stringToUnicode(filter.givenValue)}`;
}

export function changeFirstCharToLowercase(entityName: string) {
  const changedName = Array.from(entityName);
  changedName[0] = entityName[0].toLowerCase();
  return changedName.join('');
}

function makeQueryFilterVariables(
  filters: FilterConfigType[],
): QueryVariablesType {
  const queryVariables: QueryVariablesType = {};

  filters.forEach((filter: FilterConfigType) => {
    const filterName = returnFilterName(filter);
    queryVariables[filterName] = {
      ...filter,
      entityName: changeFirstCharToLowercase(filter.entityName),
    };
  });

  return queryVariables;
}

function returnFilterNames(queryVariables: QueryVariablesType): string[] {
  return Object.keys(queryVariables);
}

function returnFilterSets(
  arrayOfDataSet: FilterConfigType[][],
  labelFilter: FilterConfigType[],
): string[][] {
  const labelFilterNames = labelFilter.map((filter) =>
    returnFilterName(filter),
  );
  const filterSets: string[][] = [];
  arrayOfDataSet.forEach((dataSet: FilterConfigType[]) => {
    const commonFilterNames = dataSet.map((filter) => returnFilterName(filter));
    labelFilterNames.forEach((labelName) => {
      const dataSet = [...commonFilterNames];
      dataSet.push(labelName);
      filterSets.push(dataSet);
    });
  });
  return filterSets;
}

export interface MakeChartStickerType {
  sectionId: string;
  type: StickerContentType;
  labels: string[];
  labelFilter: FilterConfigType[];
  datasetNames: string[];
  arrayOfDataSet: FilterConfigType[][];
}

export function makeChartStickerData({
  sectionId,
  type,
  labels,
  labelFilter,
  datasetNames,
  arrayOfDataSet,
}: MakeChartStickerType): StickerDataType {
  const queryVariables: QueryVariablesType = {
    ...makeQueryFilterVariables(labelFilter),
    ...makeQueryFilterVariables(arrayOfDataSet.flat()),
  };
  const filterNames: string[] = returnFilterNames(queryVariables);
  const filterSets: string[][] = returnFilterSets(arrayOfDataSet, labelFilter);
  console.log('label', labels);
  console.log('labelFilter', labelFilter);
  console.log('filtersets', filterSets);
  const query: DocumentNode = createQuery(filterNames, labels, filterSets);

  const queryData: QueryDataType = {
    query: query,
    filters: queryVariables,
  };
  return {
    id: uuid(),
    sectionId: sectionId,
    data: {
      type: type,
      contentProps: {
        labels,
        datasetNames,
        queryData,
        options: {},
      },
    },
  };
}
export interface MakeTableStickerType {
  sectionId: string;
  type: StickerContentType;
}

export function makeTableStickerData({
  sectionId,
  type,
}: MakeTableStickerType): StickerDataType {
  return {
    id: uuid(),
    sectionId: sectionId,
    data: {
      type: type,
      contentProps: DEFAULT_TABLE_PROPS,
    },
  };
}

export interface MakeTextStickerType {
  sectionId: string;
  type: StickerContentType;
}

export function makeTextStickerData({
  sectionId,
  type,
}: MakeTextStickerType): StickerDataType {
  return {
    id: uuid(),
    sectionId: sectionId,
    data: {
      type: type,
      contentProps: {
        content: '',
      },
    },
  };
}
