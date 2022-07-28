import React from 'react';
import Dataset from './Dataset';
import { Button } from '@mui/material';
import styled from '@emotion/styled';
import { FilterConfigType } from '../Sticker/Filter.type';

interface InputDataSetType {
  datasets: FilterConfigType[][];
  setDatasets: React.Dispatch<React.SetStateAction<FilterConfigType[][]>>;
  focus: number;
  changeFocusOn: (i: number) => () => void;
}

const ScrollDiv = styled.div`
  overflow: scroll;
`;

export default function InputDatasets(props: InputDataSetType) {
  const { datasets, setDatasets, changeFocusOn, focus } = props;
  const count = datasets.length;

  function addDataSet() {
    setDatasets((prevDatasets) => [...prevDatasets, []]);
    changeFocusOn(count)();
  }

  function renderDatasets() {
    const renderDatasets = [];
    for (let i = 0; i < count; ++i) {
      const ret = [...datasets[i]];

      renderDatasets.push(
        <Dataset
          key={i}
          id={i}
          dataSet={ret}
          setDataSets={setDatasets}
          focus={focus}
          changeFocusOn={changeFocusOn(i)}
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
