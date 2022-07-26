import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { QueryFilterType } from '../../../application/services/useDataset';
import DatasetFilter from './DatasetFilter';
import SelectedFilter from './selectedFilter/SelectedFilter';

export interface DatasetAccordionProps {
  id: number;
  dataSet: QueryFilterType[];
  setDataSets: React.Dispatch<React.SetStateAction<QueryFilterType[][]>>;
  focus: number;
  onChange: () => void;
}

export default function DatasetAccordion({
  id,
  dataSet,
  setDataSets,
  focus,
  onChange,
}: DatasetAccordionProps) {
  function renderFilters() {
    return dataSet.map((filter, index) => {
      return SelectedFilter({ data: { ...filter } });
    });
  }

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
          <DatasetFilter id={id} setDataSets={setDataSets} />
          {renderFilters()}
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
