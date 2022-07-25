import * as React from 'react';
import Radio from '@mui/joy/Radio';
import RadioGroup from '@mui/joy/RadioGroup';
import styled from '@emotion/styled';

interface typeProps {
  handleType: any;
}

const types = ['pieChart', 'lineChart', 'barChart', 'table', 'title'];

const StyledDiv = styled.div`
  margin-top: 5rem;
  display: flex;
  justify-content: center;
`;

const StyledRadio = styled(Radio)`
  padding: 30px 0px;
`;

const TypeBox = (props: typeProps) => {
  const { handleType } = props;

  return (
    <StyledDiv>
      <RadioGroup
        // defaultValue="PieChart"
        onChange={(event: any) => handleType(event.target.value)}
      >
        {types.map((type) => (
          <div key={type}>
            <StyledRadio value={type} label={type} />
          </div>
        ))}
      </RadioGroup>
    </StyledDiv>
  );
};

export default TypeBox;
