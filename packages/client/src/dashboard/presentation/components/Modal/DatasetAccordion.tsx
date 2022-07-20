import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export interface DatasetAccordionProps {
  id: number;
}

export default function DatasetAccordion({ id }: DatasetAccordionProps) {
  const [filters, setFilters] = React.useState(Array<object>);
  function addFilter(newFilter: object) {
    setFilters([...filters, newFilter]);
  }
  function cancleFilter() {
    // reset default filter
  }

  function renderFilters() {
    return filters.map((filter, index) => {
      return (
        <div key={index}>
          <Typography>{'filter' + index}</Typography>
        </div>
      );
    });
  }

  return (
    <div>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Dataset {id}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {/* defaultInput(); */}
          {renderFilters()}
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
