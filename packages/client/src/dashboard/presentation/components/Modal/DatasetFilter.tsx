import * as React from 'react';
import styled from '@emotion/styled';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { QueryFilterType } from '../../../application/services/useDataset';
import { useLazyQuery } from '@apollo/client';
import createValueQuery from '../../../infrastructure/http/graphql/createValueQuery';
import LatestForm from './forms/LatestForm';
import returnColumns from './forms/menuItems/returnColumns';
import returnEntities from './forms/menuItems/returnEntities';
import returnValues from './forms/menuItems/returnValues';
import returnOperators from './forms/menuItems/returnOperators';
import FilterAttribute from './forms/FilterAttribute';

const Section = styled.div`
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

interface DatasetFilterProps {
  id: number;
  setDataSets: React.Dispatch<React.SetStateAction<QueryFilterType[][]>>;
}

function DatasetFilter(props: DatasetFilterProps) {
  const { id, setDataSets } = props;
  const [entityName, setEntityName] = React.useState('User');
  const [column, setColumn] = React.useState('coalition');
  const [operator, setOperator] = React.useState('');
  const [givenValue, setGivenValue] = React.useState('');
  const [latest, setLatest] = React.useState(true);
  const [getValues, { data, loading, error }] = useLazyQuery(
    createValueQuery(entityName, column),
  );
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :</p>;

  const addFilter = () => {
    const filter = { entityName, column, operator, givenValue, latest };
    setDataSets((prev) => {
      const newFilters = [...prev];
      newFilters[id].push(filter);
      return newFilters;
    });
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
      <LatestForm id={'Latest'} value={latest} onChange={handleLatestChange} />
      <CheckCircleOutlineIcon
        onClick={addFilter}
        color="primary"
        fontSize="large"
      />
    </Section>
  );
}

export default DatasetFilter;
