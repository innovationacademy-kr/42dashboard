import { createBachelorQuery } from '../../infrastructure/http/graphql/createQuery';
import { QueryVariablesType } from '../services/useDataset';

const filters: QueryVariablesType = {
  registration: {
    entityName: 'user',
    column: 'academic_state',
    operator: 'like',
    givenValue: '재학%',
    latest: true,
  },
  absenced: {
    entityName: 'user',
    column: 'academic_state',
    operator: 'like',
    givenValue: '휴학%',
    latest: true,
  },
  blackholed: {
    entityName: 'user',
    column: 'academic_state',
    operator: 'like',
    givenValue: '블랙홀%',
    latest: true,
  },
  breaked: {
    entityName: 'user',
    column: 'academic_state',
    operator: 'like',
    givenValue: '과정중단%',
    latest: true,
  },
  user: {
    entityName: 'user',
    column: null,
    operator: null,
    givenValue: null,
    latest: true,
  },
  common: {
    entityName: 'userLearningDataAPI',
    column: 'outcircle',
    operator: '=',
    givenValue: 'N',
    latest: true,
  },
  outter: {
    entityName: 'userLearningDataAPI',
    column: 'outcircle',
    operator: '=',
    givenValue: 'Y',
    latest: true,
  },
};

const entityNamesArray: string[] = [
  'registration',
  'absenced',
  'blackholed',
  'breaked',
  'user',
  'common',
  'outter',
];
const labels: string[] = [
  '재학',
  '휴학',
  '블랙홀',
  '과정중단',
  '총원',
  'Common Core',
  'Out Circle',
];

const datasetNames = ['학적현황', '코어현황'];
const options = {};

const DEFAULT_BACHELOR_PROPS = {
  labels,
  datasetNames,
  queryData: {
    query: createBachelorQuery(entityNamesArray, entityNamesArray),
    filters,
  },
  options,
};

export default DEFAULT_BACHELOR_PROPS;
