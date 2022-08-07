import LabelFilter from './LabelFilter';
import { useState } from 'react';
import { FilterConfigType } from '../Sticker/Filter.type';
import SelectedFilter from './SelectedFilter';
import { List } from '@mui/material';

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

  /** TODO: scroll
   * TODO:한글로 출력
   */
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
      <List>{renderSelectedFilters()}</List>
    </>
  );
}
