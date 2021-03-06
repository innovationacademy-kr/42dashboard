import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import LabelFilter from './LabelFilter';
import styled from '@emotion/styled';
import { useState } from 'react';
import { FilterConfigType } from '../Sticker/Filter.type';
import SelectedFilter from './SelectedFilter';

const Button = styled(AddCircleOutlineOutlinedIcon)`
  margin-top: 1rem;
  width: 100%;
  position: relative;
`;

export interface SelectedLabelFilters extends FilterConfigType {
  label?: string;
}

interface FiltersProps {
  setLabelAndFilter: (label: string, filter: FilterConfigType) => void;
  selectedLabels: SelectedLabelFilters[];
  setSelectedLabels: React.Dispatch<
    React.SetStateAction<SelectedLabelFilters[]>
  >;
}

export default function InputLabels(props: FiltersProps) {
  const { setLabelAndFilter, selectedLabels, setSelectedLabels } = props;
  const [count, setCount] = useState(0);

  function addFilter(newFilter: SelectedLabelFilters) {
    setCount(count + 1);
    setSelectedLabels((prevLabels) => [...prevLabels, newFilter]);
  }

  function renderSelectedFilters() {
    return selectedLabels.map((label, idx) => (
      <SelectedFilter key={idx} idx={idx} data={label} />
    ));
  }

  return (
    <>
      <LabelFilter
        setLabelAndFilter={setLabelAndFilter}
        addFilter={addFilter}
      />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {renderSelectedFilters()}
      </div>
    </>
  );
}
