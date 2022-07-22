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
let count = 0;

function returnFilterName(filter: QueryFilterType): string {
  return `${filter.entityName}${filter.column}${(count += 1)}`;
}

function makeQueryFilterVariables(
  filters: QueryFilterType[],
): QueryVariablesType {
  const queryVariables: QueryVariablesType = {};

  filters.forEach((filter: QueryFilterType) => {
    const filterName = returnFilterName(filter);
    queryVariables[filterName] = filter;
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

export default function makeStickerData(
  sectionId = 'section-1',
  type: StickerContentType = 'pieChart',
  labels: string[] = ['man', 'woman'],
  labelFilter: QueryFilterType[] = [
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
  arrayOfDataSet: QueryFilterType[][] = [
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
): StickerDataType {
  const queryVariables: QueryVariablesType = {
    ...makeQueryFilterVariables(labelFilter),
    ...makeQueryFilterVariables(arrayOfDataSet.flat()),
  };
  const fileNames: string[] = returnFileNames(queryVariables);
  const filterSets: string[][] = returnFilterSets(arrayOfDataSet, labelFilter);
  console.log('queryVariables', queryVariables);
  console.log('fileNames', fileNames);
  console.log('filterSets', filterSets);
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
