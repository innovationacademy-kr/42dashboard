import * as React from 'react';
import styled from '@emotion/styled';
import { Button } from '@mui/material';
import { useLazyQuery } from '@apollo/client';
import createValueQuery from '../../../infrastructure/http/graphql/createValueQuery';
import {
  ColumnType,
  EntityNameType,
  FilterConfigType,
  GivenValueType,
  OperatorType,
} from '../Sticker/Filter.type';
import FilterAttribute from './filterAttributes/FilterAttribute';
import returnColumns from './filterAttributes/menuItems/returnColumns';
import returnOperators from './filterAttributes/menuItems/returnOperators';
import returnValues from './filterAttributes/menuItems/returnValues';
import LatestAttribute from './filterAttributes/LatestAttribute';
import returnEntities from './filterAttributes/menuItems/returnEntities';

const Section = styled.div`
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

interface DatasetFilterProps {
  saveSelectedFilter: (queryFilter: FilterConfigType) => void;
}

export default function QueryFilterAttribute(props: DatasetFilterProps) {
  const { saveSelectedFilter } = props;
  const [entityName, setEntityName] = React.useState<EntityNameType>('User');
  const [column, setColumn] = React.useState<ColumnType>('coalition');
  const [operator, setOperator] = React.useState<OperatorType>('=');
  const [givenValue, setGivenValue] = React.useState<GivenValueType>('');
  const [latest, setLatest] = React.useState<boolean>(true);
  const [getValues, { data, loading, error }] = useLazyQuery(
    createValueQuery(entityName, column),
  );
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :</p>;

  const checkEmptyAttribute = () => {
    if (!entityName || !column || !operator || !givenValue || !latest) {
      alert('빈칸을 채워 주세요');
      return false;
    }
    return true;
  };

  const handleEntityNameChange = (event: any) => {
    setEntityName(event.target.value);
  };

  const handleColumnChange = (event: any) => {
    setColumn(event.target.value);
    getValues();
  };

  const handleOperatorChange = (event: any) => {
    setOperator(event.target.value);
  };

  const handleGivenValueChange = (event: any) => {
    setGivenValue(event.target.value);
  };

  const handleLatestChange = (event: any) => {
    setLatest((latest) => !latest);
  };

  return (
    <Section>
      <FilterAttribute
        id={'EntityName'}
        value={entityName}
        onChange={handleEntityNameChange}
        menuItems={returnEntities()}
      />
      <FilterAttribute
        id={'Column'}
        value={column}
        onChange={handleColumnChange}
        menuItems={returnColumns({ entityName })}
      />
      <FilterAttribute
        id={'Operator'}
        value={operator}
        onChange={handleOperatorChange}
        menuItems={returnOperators()}
      />
      <FilterAttribute
        id={'GivenValue'}
        value={givenValue}
        onChange={handleGivenValueChange}
        menuItems={returnValues({ entityName, column, data })}
      />
      <LatestAttribute
        id={'Latest'}
        value={latest}
        onChange={handleLatestChange}
      />
      <Button
        variant="contained"
        onClick={() =>
          checkEmptyAttribute() &&
          saveSelectedFilter({
            entityName,
            column,
            operator,
            givenValue,
            latest,
          })
        }
      >
        Save
      </Button>
    </Section>
  );
}
