import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import QueryFilterAttribute from './QueryFilterAttribute';
import SelectedFilter from './SelectedFilter';
import { FilterConfigType } from '../Sticker/Filter.type';
import TextField from '@mui/material/TextField';
import { useState } from 'react';

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
  const [message, setMessage] = useState('');

  function renderSelectedFilters() {
    return dataset.map((filter, index) => {
      return SelectedFilter({ data: { ...filter }, idx: index });
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
    setMessage(event.target.value);
    setDatasetNames((prev) => {
      prev[id] = event.target.value;
      return prev;
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
            value={datasetNames[id] || message}
            onChange={onChangeDatasetName}
          />
        </AccordionSummary>
        <AccordionDetails>
          <QueryFilterAttribute saveSelectedFilter={saveSelectedFilter} />
          {renderSelectedFilters()}
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
