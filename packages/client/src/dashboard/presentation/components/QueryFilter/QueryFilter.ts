import { gql } from '@apollo/client';

export interface Filter {
  column: string;
  entityName: string;
  givenValue: string;
  latest: boolean;
  operator: string;
}

export const Man: Filter = {
  entityName: 'userPersonalInformation',
  column: 'gender',
  operator: '=',
  givenValue: '남',
  latest: true,
};

export const Woman: Filter = {
  entityName: 'userPersonalInformation',
  column: 'gender',
  operator: '=',
  givenValue: '여',
  latest: true,
};

export const Employed: Filter = {
  entityName: 'userEmploymentAndFound',
  column: 'employment',
  operator: '=',
  givenValue: '취업',
  latest: true,
};

export const Unemployed: Filter = {
  entityName: 'userEmploymentAndFound',
  column: 'employment',
  operator: '=',
  givenValue: '미취업',
  latest: true,
};

export const Gun: Filter = {
  entityName: 'user',
  column: 'coalition',
  operator: '=',
  givenValue: '건',
  latest: true,
};

export const Gon: Filter = {
  entityName: 'user',
  column: 'coalition',
  operator: '=',
  givenValue: '곤',
  latest: true,
};

export const Gam: Filter = {
  entityName: 'user',
  column: 'coalition',
  operator: '=',
  givenValue: '감',
  latest: true,
};

export const Lee: Filter = {
  entityName: 'user',
  column: 'coalition',
  operator: '=',
  givenValue: '리',
  latest: true,
};

export const One: Filter = {
  entityName: 'user',
  column: 'grade',
  operator: '=',
  givenValue: '1기',
  latest: true,
};

export const Two: Filter = {
  entityName: 'user',
  column: 'grade',
  operator: '=',
  givenValue: '2기',
  latest: true,
};

export const Three: Filter = {
  entityName: 'user',
  column: 'grade',
  operator: '=',
  givenValue: '3기',
  latest: true,
};

export const Four: Filter = {
  entityName: 'user',
  column: 'grade',
  operator: '=',
  givenValue: '4기',
  latest: true,
};

export const Grade3: Filter = {
  entityName: 'user',
  column: 'grade',
  operator: '=',
  givenValue: '3기',
  latest: true,
};

export const EMPLOYMENT = gql`
  query GetNumOfPeopleByFilter($employed: Filter!, $unemployed: Filter!) {
    employed: getNumOfPeopleByFilter(filters: [$employed])
    unemployed: getNumOfPeopleByFilter(filters: [$unemployed])
  }
`;

export const GENDER = gql`
  query GetNumOfPeopleByFilter($man: Filter!, $woman: Filter!) {
    man: getNumOfPeopleByFilter(filters: [$man])
    woman: getNumOfPeopleByFilter(filters: [$woman])
  }
`;

export const COALITION = gql`
  query GetNumOfPeopleByFilter(
    $gun: Filter!
    $gon: Filter!
    $gam: Filter!
    $lee: Filter!
  ) {
    gun: getNumOfPeopleByFilter(filters: [$gun])
    gon: getNumOfPeopleByFilter(filters: [$gon])
    gam: getNumOfPeopleByFilter(filters: [$gam])
    lee: getNumOfPeopleByFilter(filters: [$lee])
  }
`;

export const GRADE = gql`
  query GetNumOfPeopleByFilter(
    $one: Filter!
    $two: Filter!
    $three: Filter!
    $four: Filter!
  ) {
    one: getNumOfPeopleByFilter(filters: [$one])
    two: getNumOfPeopleByFilter(filters: [$two])
    three: getNumOfPeopleByFilter(filters: [$three])
    four: getNumOfPeopleByFilter(filters: [$four])
  }
`;

export const USERS = gql`
  query GetPeopleByFilter($user: Filter!) {
    getPeopleByFilter(filters: [$user]) {
      intra_no
      intra_id
      name
      academic_state
      coalition
    }
  }
`;
