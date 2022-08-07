import styled from '@emotion/styled';
import { Button } from '@mui/material';
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
import LatestAttribute from './filterAttributes/LatestAttribute';
import returnEntities from './filterAttributes/menuItems/returnEntities';
import { useState } from 'react';
import ValueAttribute from './filterAttributes/ValueAttribute';

const Section = styled.div`
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

interface DatasetFilterProps {
  saveSelectedFilter: (queryFilter: FilterConfigType) => void;
  setLabel?: React.Dispatch<React.SetStateAction<string>>;
}

export default function QueryFilterAttribute(props: DatasetFilterProps) {
  const { saveSelectedFilter, setLabel } = props;
  const [entityName, setEntityName] = useState<EntityNameType>('');
  const [column, setColumn] = useState<ColumnType>('');
  const [operator, setOperator] = useState<OperatorType>('=');
  const [givenValue, setGivenValue] = useState<GivenValueType>('');
  const [latest, setLatest] = useState<boolean>(true);

  const checkEmptyAttribute = () => {
    if (!entityName || !column || !operator || !givenValue || !latest) {
      alert('빈칸을 채워 주세요');
      return false;
    }
    return true;
  };

  const handleEntityNameChange = (event: any) => {
    setGivenValue('');
    setColumn('');
    setEntityName(event.target.value);
  };

  const handleColumnChange = (event: any) => {
    setGivenValue('');
    setColumn(event.target.value || '');
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
  function resetValues() {
    setEntityName('');
    setColumn('');
    setOperator('=');
    setGivenValue('');
    setLatest(true);
    if (setLabel) setLabel('');
  }

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
      <ValueAttribute
        id={'GivenValue'}
        value={givenValue}
        onChange={handleGivenValueChange}
        entityName={entityName || 'None'}
        column={column || 'None'}
      />
      <LatestAttribute
        id={'Latest'}
        value={latest}
        onChange={handleLatestChange}
      />
      <Button
        variant="contained"
        onClick={() => {
          checkEmptyAttribute() &&
            saveSelectedFilter({
              entityName,
              column,
              operator,
              givenValue,
              latest,
            });
          resetValues();
        }}
      >
        Save
      </Button>
    </Section>
  );
}
