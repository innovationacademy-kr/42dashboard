import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import QueryFilterAttribute from './QueryFilterAttribute';
import SelectedFilter from './SelectedFilter';
import { FilterConfigType } from '../Sticker/Filter.type';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { Button } from '@mui/material';

export interface DatasetProps {
  id: number;
  dataset: FilterConfigType[];
  setDatasets: React.Dispatch<React.SetStateAction<FilterConfigType[][]>>;
  datasetNames: string[];
  setDatasetNames: React.Dispatch<React.SetStateAction<string[]>>;
  focus: number;
  changeFocusOn: () => void;
}

export default function Dataset({
  id,
  dataset,
  setDatasets,
  datasetNames,
  setDatasetNames,
  focus,
  changeFocusOn,
}: DatasetProps) {
  function renderSelectedFilters() {
    return dataset.map((filter, index) => {
      function removeFilter() {
        setDatasets((prevDatasets) => {
          const newDatasets = [...prevDatasets];
          newDatasets[id] = [...newDatasets[id]];
          newDatasets[id].splice(index, 1);
          return newDatasets;
        });
      }

      return SelectedFilter({
        data: { ...filter },
        idx: index,
        removeFilter,
      });
    });
  }

  function removeDataset() {
    setDatasets((prevDatasets: FilterConfigType[][]) => {
      const newDatasets = [...prevDatasets];
      newDatasets.splice(id, 1);
      if (newDatasets.length > 0) return newDatasets;
      else return [[]];
    });
    setDatasetNames((prevDatasetNames: string[]) => {
      const newDatasetNames = [...prevDatasetNames];
      newDatasetNames.splice(id, 1);
      return newDatasetNames;
    });
  }

  const saveSelectedFilter = (queryFilter: FilterConfigType) => {
    setDatasets((prev) => {
      const newFilters = [...prev];
      newFilters[id].push(queryFilter);
      return newFilters;
    });
  };
  const onChangeDatasetName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDatasetNames((prev) => {
      const newDatasetNames = [...prev];
      newDatasetNames[id] = event.target.value;
      return newDatasetNames;
    });
  };

  return (
    <div>
      <Accordion expanded={id === focus} onChange={changeFocusOn}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls={`${id}`}
          id={`${id}`}
        >
          <TextField
            placeholder={`Dataset ${id}`}
            variant="standard"
            value={datasetNames[id] ?? ''}
            onChange={onChangeDatasetName}
          />
          <Button onClick={removeDataset}>Delete</Button>
        </AccordionSummary>
        <AccordionDetails>
          <QueryFilterAttribute saveSelectedFilter={saveSelectedFilter} />
          {renderSelectedFilters()}
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
