import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { QueryFilterType } from '../../../application/services/useDataset';
import DatasetFilter from './DatasetFilter';

export interface DatasetAccordionProps {
  id: number;
  dataSet: QueryFilterType[];
  setDataSets: React.Dispatch<React.SetStateAction<QueryFilterType[][]>>;
}

export default function DatasetAccordion({
  id,
  dataSet,
  setDataSets,
}: DatasetAccordionProps) {
  function renderFilters() {
    return dataSet.map((filter, index) => {
      return (
        <div key={index}>
          <Typography>{`${filter.entityName} ${filter.column} ${filter.givenValue}`}</Typography>
          <button>삭제(필터)</button>
        </div>
      );
    });
  }

  return (
    <div>
      <Accordion>
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
