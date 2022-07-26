import * as React from 'react';
import styled from '@emotion/styled';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import createValueQuery from '../../../infrastructure/http/graphql/createValueQuery';
import { useLazyQuery } from '@apollo/client';
import LabelForm from './filterAttributes/LabelAttribute';
import LatestForm from './filterAttributes/LatestAttribute';
import returnColumns from './filterAttributes/menuItems/returnColumns';
import returnEntities from './filterAttributes/menuItems/returnEntities';
import returnValues from './filterAttributes/menuItems/returnValues';
import returnOperators from './filterAttributes/menuItems/returnOperators';
import FilterAttribute from './filterAttributes/FilterAttribute';
import { SelectedLabelFilters } from './Filters';
import { EntityNameType, OperatorType } from '../Sticker/Filter.type';
import LatestAttribute from './filterAttributes/LatestAttribute';
import LabelAttribute from './filterAttributes/LabelAttribute';

const Section = styled.div`
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

interface LabelFilterProps {
  setLabels: React.Dispatch<React.SetStateAction<string[]>>;
  setFilters: any;
  addFilter: (newFilter: SelectedLabelFilters) => void;
}

function LabelFilter(props: LabelFilterProps) {
  const { addFilter, setLabels, setFilters } = props;
  const [label, setLabel] = React.useState<string>('');
  const [entityName, setEntityName] = React.useState<EntityNameType>('User');
  const [column, setColumn] = React.useState('coalition');
  const [operator, setOperator] = React.useState<OperatorType>('=');
  const [givenValue, setGivenValue] = React.useState('');
  const [latest, setLatest] = React.useState(true);
  const [getValues, { data, loading, error }] = useLazyQuery(
    createValueQuery(entityName, column),
  );
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :</p>;

  const saveSelectedFilter = () => {
    const filter = { entityName, column, operator, givenValue, latest };
    if (!entityName || !column || !operator || !givenValue || !latest) {
      alert('Please fill all the fields');
      return;
    }
    setLabels((labels) => [...labels, label]);
    setFilters((filters: any) => [...filters, filter]);
    addFilter({
      label,
      entityName,
      column,
      operator,
      givenValue,
      latest,
    });
    setLabel('');
    setEntityName('User');
    setColumn('coalition');
    setOperator('=');
    setGivenValue('');
    setLatest(true);
  };

  const handleLabelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLabel(event.target.value);
  };
  const handleEntityChange = (event: any) => {
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
      <LabelAttribute value={label} onChange={handleLabelChange} />
      <FilterAttribute
        id={'EntityName'}
        value={entityName}
        onChange={handleEntityChange}
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
      <CheckCircleOutlineIcon
        onClick={saveSelectedFilter}
        color="primary"
        fontSize="large"
      />
    </Section>
  );
}

export default LabelFilter;
