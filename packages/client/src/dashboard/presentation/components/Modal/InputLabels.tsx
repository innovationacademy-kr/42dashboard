import LabelFilter from './LabelFilter';
import { useState } from 'react';
import { FilterConfigType } from '../Sticker/Filter.type';
import SelectedFilter from './SelectedFilter';
import { Button, List } from '@mui/material';

export interface SelectedLabelFilters extends FilterConfigType {
  label?: string;
}

interface FiltersProps {
  setLabelAndFilter: (label: string, filter: FilterConfigType) => void;
  selectedLabels: SelectedLabelFilters[];
  setSelectedLabels: React.Dispatch<
    React.SetStateAction<SelectedLabelFilters[]>
  >;
  chartProps: {
    labels: string[];
    setLabels: React.Dispatch<React.SetStateAction<string[]>>;
    filters: FilterConfigType[];
    setFilters: React.Dispatch<React.SetStateAction<FilterConfigType[]>>;
    datasets: FilterConfigType[][];
    setDatasets: React.Dispatch<React.SetStateAction<FilterConfigType[][]>>;
    datasetNames: string[];
    setDatasetNames: React.Dispatch<React.SetStateAction<string[]>>;
  };
}

export default function InputLabels(props: FiltersProps) {
  const { setLabelAndFilter, selectedLabels, setSelectedLabels, chartProps } =
    props;
  const {
    labels,
    setLabels,
    filters,
    setFilters,
    datasets,
    setDatasets,
    datasetNames,
    setDatasetNames,
  } = chartProps;

  const [count, setCount] = useState(0);

  function addFilter(newFilter: SelectedLabelFilters) {
    setCount(count + 1);
    setSelectedLabels((prevLabels) => [...prevLabels, newFilter]);
  }
  function removeFilter(idx: number) {
    setSelectedLabels((prevLabels) => {
      const newLabels = [...prevLabels];
      newLabels.splice(idx, 1);
      return newLabels;
    });
    setLabels((prevLabels) => {
      const newLabels = [...prevLabels];
      newLabels.splice(idx, 1);
      return newLabels;
    });
    setFilters((prevFilters) => {
      const newFilters = [...prevFilters];
      newFilters.splice(idx, 1);
      return newFilters;
    });
    setCount((count) => count - 1);
  }

  function renderSelectedFilters() {
    return selectedLabels.map((label, idx) => (
      <SelectedFilter
        key={idx}
        idx={idx}
        data={label}
        removeFilter={removeFilter}
      />
    ));
  }

  return (
    <>
      <LabelFilter
        setLabelAndFilter={setLabelAndFilter}
        addFilter={addFilter}
      />
      <List style={{ maxHeight: 400, overflow: 'auto' }}>
        {renderSelectedFilters()}
      </List>
    </>
  );
}
