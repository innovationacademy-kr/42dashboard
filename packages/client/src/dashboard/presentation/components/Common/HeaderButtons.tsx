import React from 'react';
import styled from '@emotion/styled';
import { InvisibleButton } from '../Button/InvisibleButton';

type parentComponentType = 'SECTION' | 'STICKER';

interface HeaderButtonsProps {
  parentComponent: parentComponentType;
}

const ButtonsArea = styled.div``;

const renderButtons = (buttonType: parentComponentType) => {
  let renderList = [];
  if (buttonType === 'SECTION') renderList = ['EDIT', 'FILTER', 'CLOSE'];
  else renderList = ['EDIT', 'CLOSE'];
  return renderList.map((type, i) => (
    <InvisibleButton key={i} buttonType={type} />
  ));
};

export const HeaderButtons = (props: HeaderButtonsProps) => {
  const { parentComponent } = props;
  return <ButtonsArea>{renderButtons(parentComponent)}</ButtonsArea>;
};
