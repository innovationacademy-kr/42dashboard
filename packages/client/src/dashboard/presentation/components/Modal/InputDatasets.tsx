import React from 'react';
import Dataset from './Dataset';
import { Button } from '@mui/material';
import styled from '@emotion/styled';
import { FilterConfigType } from '../Sticker/Filter.type';

interface InputDataSetType {
  datasets: FilterConfigType[][];
  setDatasets: React.Dispatch<React.SetStateAction<FilterConfigType[][]>>;
  datasetNames: string[];
  setDatasetNames: React.Dispatch<React.SetStateAction<string[]>>;
  focus: number;
  changeFocusOn: (i: number) => () => void;
}

const ScrollDiv = styled.div`
  overflow: scroll;
`;

export default function InputDatasets(props: InputDataSetType) {
  const {
    datasets,
    setDatasets,
    datasetNames,
    setDatasetNames,
    changeFocusOn,
    focus,
  } = props;
  const count = datasets.length;

  function addDataSet() {
    setDatasets((prevDatasets) => [...prevDatasets, []]);
    changeFocusOn(count)();
  }

  function renderDatasets() {
    const renderDatasets = [];
    for (let idx = 0; idx < count; ++idx) {
      const ret = [...datasets[idx]];

      renderDatasets.push(
        <Dataset
          key={idx}
          id={idx}
          dataset={ret}
          setDatasets={setDatasets}
          datasetNames={datasetNames}
          setDatasetNames={setDatasetNames}
          focus={focus}
          changeFocusOn={changeFocusOn(idx)}
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
