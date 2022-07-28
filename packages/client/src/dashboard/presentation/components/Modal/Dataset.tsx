import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { QueryFilterType } from '../../../application/services/useDataset';
import QueryFilterAttribute from './QueryFilterAttribute';
import SelectedFilter from './SelectedFilter';

export interface DatasetProps {
  id: number;
  dataSet: QueryFilterType[];
  setDataSets: React.Dispatch<React.SetStateAction<QueryFilterType[][]>>;
  focus: number;
  onChange: () => void;
}

export default function Dataset({
  id,
  dataSet,
  setDataSets,
  focus,
  onChange,
}: DatasetProps) {
  function renderSelectedFilters() {
    return dataSet.map((filter, index) => {
      return SelectedFilter({ data: { ...filter }, idx: index });
    });
  }

  const saveSelectedFilter = (queryFilter: QueryFilterType) => {
    setDataSets((prev) => {
      const newFilters = [...prev];
      newFilters[id].push(queryFilter);
      return newFilters;
    });
  };

  return (
    <div>
      <Accordion expanded={id === focus} onChange={onChange}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls={`${id}`}
          id={`${id}`}
        >
          <Typography>Dataset {id}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <QueryFilterAttribute saveSelectedFilter={saveSelectedFilter} />
          {renderSelectedFilters()}
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
