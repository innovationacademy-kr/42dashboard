import StickerDataType from '../../../domain/stickerDatas/stickerData.type';
import createQuery from '../../../infrastructure/http/graphql/createQuery';
import { v4 as uuid } from 'uuid';
import {
  QueryDataType,
  QueryFilterType,
  QueryVariablesType,
} from '../../../application/services/useDataset';
import { DocumentNode } from '@apollo/client';
import { StickerContentType } from '../Sticker/StickerContent.type';

function stringToUnicode(str: string): string {
  let ret = '';
  for (let i = 0; i < str.length; i++) {
    ret += str.charCodeAt(i);
  }
  return ret;
}

function returnFilterName(filter: QueryFilterType): string {
  return `${filter.entityName}${filter.column}${stringToUnicode(
    filter.operator,
  )}${stringToUnicode(filter.givenValue)}`;
}

function changeFirstCharOfEntity(entityName: string) {
  const changedName = Array.from(entityName);
  changedName[0] = entityName[0].toLowerCase();
  return changedName.join('');
}

function makeQueryFilterVariables(
  filters: QueryFilterType[],
): QueryVariablesType {
  const queryVariables: QueryVariablesType = {};

  filters.forEach((filter: QueryFilterType) => {
    const filterName = returnFilterName(filter);
    queryVariables[filterName] = {
      ...filter,
      entityName: changeFirstCharOfEntity(filter.entityName),
    };
  });

  return queryVariables;
}

function returnFileNames(queryVariables: QueryVariablesType): string[] {
  return Object.keys(queryVariables);
}

function returnFilterSets(
  arrayOfDataSet: QueryFilterType[][],
  labelFilter: QueryFilterType[],
): string[][] {
  const labelFilterNames = labelFilter.map((filter) =>
    returnFilterName(filter),
  );
  const filterSets: string[][] = [];
  arrayOfDataSet.forEach((dataSet: QueryFilterType[]) => {
    const commonFilterNames = dataSet.map((filter) => returnFilterName(filter));
    labelFilterNames.forEach((labelName) => {
      const dataSet = [...commonFilterNames];
      dataSet.push(labelName);
      filterSets.push(dataSet);
    });
  });
  return filterSets;
}

export interface MakeStickerType {
  sectionId: string;
  type: StickerContentType;
  labels: string[];
  labelFilter: QueryFilterType[];
  arrayOfDataSet: QueryFilterType[][];
}

export default function makeStickerData(
  { sectionId, type, labels, labelFilter, arrayOfDataSet }: MakeStickerType = {
    sectionId: 'section-1',
    type: 'pieChart',
    labels: ['man', 'woman'],
    labelFilter: [
      {
        entityName: 'userPersonalInformation',
        column: 'gender',
        operator: '=',
        givenValue: '여',
        latest: true,
      },
      {
        entityName: 'userPersonalInformation',
        column: 'gender',
        operator: '=',
        givenValue: '남',
        latest: true,
      },
    ],
    arrayOfDataSet: [
      [
        {
          entityName: 'user',
          column: 'grade',
          operator: '=',
          givenValue: '2기',
          latest: true,
        },
      ],
      [],
    ],
  },
): StickerDataType {
  const queryVariables: QueryVariablesType = {
    ...makeQueryFilterVariables(labelFilter),
    ...makeQueryFilterVariables(arrayOfDataSet.flat()),
  };
  const fileNames: string[] = returnFileNames(queryVariables);
  const filterSets: string[][] = returnFilterSets(arrayOfDataSet, labelFilter);
  const query: DocumentNode = createQuery(fileNames, labels, filterSets);
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
        labels: labels,
        queryData,
        options: {},
      },
    },
  };
}
