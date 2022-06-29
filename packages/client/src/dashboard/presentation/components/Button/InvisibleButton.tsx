import React from 'react';
import styled from '@emotion/styled';

interface InvisibleButtonProps {
  buttonType: string;
}

const Button = styled.button`
  margin: 0 0.5rem;
`;

export const InvisibleButton = (props: InvisibleButtonProps) => {
  const { buttonType } = props;
  return <Button>{buttonType}</Button>;
};
