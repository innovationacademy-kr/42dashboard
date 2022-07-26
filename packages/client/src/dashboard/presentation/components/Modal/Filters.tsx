import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import LabelFilter from './LabelFilter';
import styled from '@emotion/styled';
import { useState } from 'react';
import { QueryFilterType } from '../../../application/services/useDataset';
import { FilterConfigType } from '../Sticker/Filter.type';
import SelectedFilter from './selectedFilter/SelectedFilter';

const Button = styled(AddCircleOutlineOutlinedIcon)`
  margin-top: 1rem;
  width: 100%;
  position: relative;
`;

export interface SelectedLabelFilters extends FilterConfigType {
  label?: string;
  latest?: boolean;
}

interface FiltersProps {
  setLabels: React.Dispatch<React.SetStateAction<string[]>>;
  setFilters: React.Dispatch<React.SetStateAction<QueryFilterType[]>>;
  selectedLabels: SelectedLabelFilters[];
  setSelectedLabels: React.Dispatch<
    React.SetStateAction<SelectedLabelFilters[]>
  >;
}

function Filters(props: FiltersProps) {
  const { setLabels, setFilters, selectedLabels, setSelectedLabels } = props;
  const [count, setCount] = useState(0);

  function addFilter(newFilter: SelectedLabelFilters) {
    setCount(count + 1);
    setSelectedLabels((prevLabels) => [...prevLabels, newFilter]);
  }

  function renderSelectedFilters() {
    return selectedLabels.map((label, idx) => (
      <SelectedFilter idx={idx} data={label} />
    ));
  }

  return (
    <>
      <LabelFilter
        addFilter={addFilter}
        setLabels={setLabels}
        setFilters={setFilters}
      />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {renderSelectedFilters()}
      </div>
    </>
  );
}

export default Filters;
