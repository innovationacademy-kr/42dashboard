import * as React from 'react';
import styled from '@emotion/styled';
import { SelectedLabelFilters } from './InputLabels';
import LabelAttribute from './filterAttributes/LabelAttribute';
import QueryFilterAttribute from './QueryFilterAttribute';
import { FilterConfigType } from '../Sticker/Filter.type';

const Section = styled.div`
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

interface LabelFilterProps {
  setLabelAndFilter: (label: string, filter: FilterConfigType) => void;
  addFilter: (newFilter: SelectedLabelFilters) => void;
}

function LabelFilter(props: LabelFilterProps) {
  const { setLabelAndFilter, addFilter } = props;
  const [label, setLabel] = React.useState<string>('');

  const saveSelectedFilter = (queryFilter: FilterConfigType) => {
    setLabelAndFilter(label, queryFilter);
    addFilter({ label, ...queryFilter });
  };

  const handleLabelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLabel(event.target.value);
  };

  /** TODO: 수평맞추기 */
  return (
    <Section>
      <LabelAttribute value={label} onChange={handleLabelChange} />
      <QueryFilterAttribute
        saveSelectedFilter={saveSelectedFilter}
        setLabel={setLabel}
      />
    </Section>
  );
}

export default LabelFilter;
