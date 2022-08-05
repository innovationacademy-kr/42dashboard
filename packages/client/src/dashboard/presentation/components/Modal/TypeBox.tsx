import * as React from 'react';
import Radio from '@mui/joy/Radio';
import RadioGroup from '@mui/joy/RadioGroup';
import styled from '@emotion/styled';
import { StickerContentType } from '../Sticker/StickerContent.type';

interface typeProps {
  handleType: React.Dispatch<React.SetStateAction<StickerContentType>>;
}

const types = [
  'pieChart',
  'lineChart',
  'barChart',
  'table',
  'text',
  'bachelor',
];

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
      <RadioGroup onChange={(event: any) => handleType(event.target.value)}>
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
