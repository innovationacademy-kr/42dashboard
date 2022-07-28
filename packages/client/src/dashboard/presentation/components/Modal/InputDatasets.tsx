import React from 'react';
import Dataset from './Dataset';
import { Button } from '@mui/material';
import styled from '@emotion/styled';
import { QueryFilterType } from '../../../application/services/useDataset';

interface InputDataSetType {
  dataSets: QueryFilterType[][];
  setDataSets: React.Dispatch<React.SetStateAction<QueryFilterType[][]>>;
  focus: number;
  onChange: (i: number) => () => void;
}

const ScrollDiv = styled.div`
  overflow: scroll;
`;

export default function InputDatasets(props: InputDataSetType) {
  const { dataSets, setDataSets, onChange, focus } = props;
  const count = dataSets.length;

  function addDataSet() {
    setDataSets((prevDataSets) => [...prevDataSets, []]);
    onChange(count)();
  }

  function renderDatasets() {
    const renderDatasets = [];
    for (let i = 0; i < count; ++i) {
      const ret = [...dataSets[i]];

      renderDatasets.push(
        <Dataset
          key={i}
          id={i}
          dataSet={ret}
          setDataSets={setDataSets}
          focus={focus}
          onChange={onChange(i)}
        />,
      );
    }
    return renderDatasets.length > 0 ? renderDatasets : null;
  }
  return (
    <ScrollDiv>
      <Button onClick={addDataSet}>add</Button>
      {renderDatasets()}
    </ScrollDiv>
  );
}
