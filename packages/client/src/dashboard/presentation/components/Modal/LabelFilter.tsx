import * as React from 'react';
import styled from '@emotion/styled';
import { SelectedLabelFilters } from './InputLabels';
import LabelAttribute from './filterAttributes/LabelAttribute';
import { QueryFilterType } from '../../../application/services/useDataset';
import QueryFilterAttribute from './QueryFilterAttribute';

const Section = styled.div`
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

interface LabelFilterProps {
  setLabelAndFilter: (label: string, filter: QueryFilterType) => void;
  addFilter: (newFilter: SelectedLabelFilters) => void;
}

function LabelFilter(props: LabelFilterProps) {
  const { setLabelAndFilter, addFilter } = props;
  const [label, setLabel] = React.useState<string>('');

  const saveSelectedFilter = (queryFilter: QueryFilterType) => {
    setLabelAndFilter(label, queryFilter);
    addFilter({ label, ...queryFilter });
  };

  const handleLabelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLabel(event.target.value);
  };

  return (
    <Section>
      <LabelAttribute value={label} onChange={handleLabelChange} />
      <QueryFilterAttribute saveSelectedFilter={saveSelectedFilter} />
    </Section>
  );
}

export default LabelFilter;
