import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import LabelFilter from './LabelFilter';
import styled from '@emotion/styled';
import { useState } from 'react';
import { QueryFilterType } from './Modal';

const Button = styled(AddCircleOutlineOutlinedIcon)`
  margin-top: 1rem;
  width: 100%;
  position: relative;
`;

interface FiltersProps {
  setLabels: React.Dispatch<React.SetStateAction<string[]>>;
  setFilters: React.Dispatch<React.SetStateAction<QueryFilterType[]>>;
}

function Filters(props: FiltersProps) {
  const { setLabels, setFilters } = props;
  const [count, setCount] = useState(1);

  function AddFilter() {
    setCount(count + 1);
  }

  function renderDatasets() {
    const ret = [];
    for (let i = 1; i <= count; i++) {
      ret.push(
        <LabelFilter key={i} setLabels={setLabels} setFilters={setFilters} />,
      );
    }
    return ret;
  }

  return (
    <>
      {renderDatasets()}
      <Button onClick={AddFilter} color="primary" fontSize="large" />
    </>
  );
}

export default Filters;
