import {
  QueryDataType,
  QueryVariablesType,
  TableQueryIngredientType,
} from './../../../application/services/useDataset';
import StickerDataType from '../../../domain/stickerDatas/stickerData.type';
import { v4 as uuid } from 'uuid';
import { StickerContentType } from '../Sticker/StickerContent.type';
import { FilterConfigType } from '../Sticker/Filter.type';
import {
  createAllColumnDatas,
  createAllEntityFilters,
  createAllEntityNamesArray,
  createFieldsLiterals,
} from '../../../application/utils/DEFAULT_TABLE_PROPS';
import camelize from '../../../application/utils/camelize';
import stringToUnicode from '../../../application/utils/stringToNum';
import DEFAULT_BACHELOR_PROPS from '../../../application/utils/DEFAULT_BACHELOR_PROPS';

function returnFilterName(filter: FilterConfigType): string {
  return `${filter.entityName}${filter.column}${
    filter.operator && stringToUnicode(filter.operator)
  }${stringToUnicode(filter.givenValue)}`;
}

function makeQueryFilterVariables(
  filters: FilterConfigType[],
): QueryVariablesType {
  const queryVariables: QueryVariablesType = {};

  filters.forEach((filter: FilterConfigType) => {
    const filterName = returnFilterName(filter);
    queryVariables[filterName] = {
      ...filter,
      entityName: camelize(filter.entityName),
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
  startDate?: Date;
  endDate?: Date;
}

export function makeChartStickerData({
  sectionId,
  type,
  labels,
  labelFilter,
  datasetNames,
  arrayOfDataSet,
  startDate,
  endDate,
}: MakeChartStickerType): StickerDataType {
  const queryVariables: QueryVariablesType = {
    ...makeQueryFilterVariables(labelFilter),
    ...makeQueryFilterVariables(arrayOfDataSet.flat()),
  };
  const filterNames: string[] = returnFilterNames(queryVariables);
  const filterSetsPerData: string[][] = returnFilterSets(
    arrayOfDataSet,
    labelFilter,
  );

  const queryData: QueryDataType = {
    queryIngredient: {
      filterNames,
      labels,
      filterSetsPerData,
      startDate,
      endDate,
    },
    filters: queryVariables,
    stickerContentType: type,
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
  const tableQueryIngredient: TableQueryIngredientType = {
    filterNames: createAllEntityNamesArray(),
    fields: createFieldsLiterals(),
  };

  const queryData: QueryDataType = {
    stickerContentType: 'table',
    queryIngredient: tableQueryIngredient,
    filters: createAllEntityFilters(),
  };

  return {
    id: uuid(),
    sectionId: sectionId,
    data: {
      type: type,
      contentProps: {
        columns: createAllColumnDatas(),
        queryData,
      },
    },
  };
}

export function makeBachelorStickerData({
  sectionId,
  type,
}: MakeTableStickerType): StickerDataType {
  return {
    id: uuid(),
    sectionId,
    data: {
      type,
      contentProps: DEFAULT_BACHELOR_PROPS,
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
