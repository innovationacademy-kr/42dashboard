import { EntityColumn } from 'common/src';
import { createQueryForTable } from '../../infrastructure/http/graphql/createQuery';
import { ColumnDataType } from '../../presentation/components/Table/Table';
import { QueryVariablesType } from '../services/useDataset';
import camelize from './camelize';

const createAllColumnDatas = () => {
  const allColumns: ColumnDataType[] = [];
  for (const value of Object.values(EntityColumn)) {
    value.forEach((column) => {
      allColumns.push({
        id: column.dbName,
        label: column.spName,
      });
    });
  }
  return allColumns;
};

const createFieldsLiterals = () => {
  const fieldLiterals: string[] = [];

  for (const [key, value] of Object.entries(EntityColumn)) {
    if (key === 'User') {
      value.forEach((column) => fieldLiterals.push(column.dbName));
    } else {
      const fieldLiteral = `${camelize(key)} {${value
        .map((column) => column.dbName)
        .join(',')}}`;
      fieldLiterals.push(fieldLiteral);
    }
  }
  return fieldLiterals;
};

const createAllEntityNamesArray = () => {
  const allEntityNames: string[] = [];
  for (const key of Object.keys(EntityColumn)) {
    allEntityNames.push(key);
  }
  return allEntityNames;
};

const createAllEntityFilters = () => {
  const allEntityFilters: QueryVariablesType = {};
  for (const key of Object.keys(EntityColumn)) {
    allEntityFilters[key] = {
      entityName: camelize(key),
      column: null,
      operator: null,
      givenValue: null,
      latest: true,
    };
  }
  console.log(allEntityFilters);
  return allEntityFilters;
};
const DEFAULT_TABLE_PROPS = {
  columns: createAllColumnDatas(),
  queryData: {
    query: createQueryForTable(
      createAllEntityNamesArray(),
      createFieldsLiterals(),
    ),
    filters: createAllEntityFilters(),
  },
};

export default DEFAULT_TABLE_PROPS;
