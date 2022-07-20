import React from 'react';
import DatasetAccordion from './DatasetAccordion';
import { Button } from '@mui/material';
import styled from '@emotion/styled';

const ScrollDiv = styled.div`
  overflow: scroll;
`;

export default function InputDataset() {
  const [count, setCount] = React.useState(1);

  function addDataset() {
    setCount((count) => count + 1);
  }
  function renderDatasets() {
    const ret = [];
    for (let i = 1; i <= count; ++i) {
      ret.push(<DatasetAccordion key={i} id={i} />);
    }
    return ret;
  }
  return (
    <ScrollDiv>
      <Button onClick={addDataset}>add</Button>
      {renderDatasets()}
    </ScrollDiv>
  );
}
