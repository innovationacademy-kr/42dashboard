import { gql } from '@apollo/client';

/**
 *
 * @param filterNames
 * @returns
 * [$nameOfFilter1: Filter!, $nameOfFilter2: Filter!, $nameOfFilter3: Filter!]
 */
function returnFilterVariables(filterNames: string[]): string[] {
  const arrayOfFilterName = filterNames.map(
    (filterName): string => `$${filterName}: Filter!`,
  );
  return arrayOfFilterName;
}
/**
 * @param filterSet
 * @returns
 * `$nameOfFilter1, $nameOfFilter1, $nameOfFilter2`
 */
function returnFilters(filterSet: string[]): string {
  const filters = filterSet.map((filterName): string => `$${filterName}`);
  return filters.join(', ');
}

/**
 *
 * @param index
 * @returns
 * alias
 */
function returnAlias(labels: string[], index: number): string {
  const serialNumber = Math.floor(index / labels.length);
  return `a${index}${serialNumber}`;
}

/**
 * sometin: getNumOfPeopleByFilter(filters: [$filtersGrade, $filtersMan])
 */
function returnRequest(labels: string[]) {
  return (filterSet: string[], index: number): string => {
    const alias = returnAlias(labels, index);
    const queryName = 'getNumOfPeopleByFilter';
    const filters = returnFilters(filterSet);
    return `${alias}: ${queryName}(filters: [${filters}])`;
  };
}

function returnVariables(
  filterNames: string[],
  startDate?: Date,
  endDate?: Date,
  skip?: number,
  take?: number,
) {
  const filterNamesLiteral = `filters: [${returnFilters(filterNames)}]`;
  const startDateLiteral = startDate ? `startDate: ${startDate}` : '';
  const endDateLiteral = endDate ? `endDate: ${endDate}` : '';
  const skipLiteral = skip ? `skip: ${skip}` : '';
  const takeLiteral = take ? `take: ${take}` : '';

  const Variables = [
    filterNamesLiteral,
    startDateLiteral,
    endDateLiteral,
    skipLiteral,
    takeLiteral,
  ].join('\n');

  return Variables;
}

/**
 * @param filterNames
 * @param labels
 * @param filterSetsPerData
 * @returns
 * `query queryName(
 * $filtersGrade: Filter!
 * ) {
 *   alias: getNumOfPeopleByFilter(filters: [$filtersGrade])
 * }`
 */
export default function createQuery(
  filterNames: string[],
  labels: string[],
  filterSetsPerData: string[][],
) {
  //TODO : error handlers

  const query = `query GetDatasets(
    ${returnFilterVariables(filterNames).join('\n')}
  ) {
    ${filterSetsPerData.map(returnRequest(labels)).join('\n')}
  }`;
  return gql(query);
}

export function createQueryForTable(
  filterNames: string[],
  fields: (string | object)[],
  startDate?: Date,
  endDate?: Date,
  skip?: number,
  take?: number,
) {
  const variables = returnVariables(
    filterNames,
    startDate,
    endDate,
    skip,
    take,
  );
  const query = `query GetTableDatas(
    ${returnFilterVariables(filterNames).join('\n')}
    ) {
       getPeopleByFilter(${variables}
       ) {
        ${fields.join(',\n')}
       }
    }
  `;
  return gql(query);
}
