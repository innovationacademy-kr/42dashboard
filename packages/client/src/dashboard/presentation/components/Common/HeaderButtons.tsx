import React from 'react';
import styled from '@emotion/styled';
import { InvisibleButton } from '../Button/InvisibleButton';

type parentComponentType = 'SECTION' | 'STICKER';

interface HeaderButtonsProps {
  parentComponent: parentComponentType;
  clickHandler: () => void;
}

const ButtonsArea = styled.div``;

const renderButtons = (
  buttonType: parentComponentType,
  clickHandler: () => void,
) => {
  let renderList = [];
  if (buttonType === 'SECTION') renderList = ['EDIT', 'FILTER', 'CLOSE'];
  else renderList = ['EDIT', 'CLOSE'];
  return renderList.map((type, i) => (
    <InvisibleButton
      key={i}
      buttonType={type}
      clickHandler={
        type === 'CLOSE' ? clickHandler : () => console.log('clicked')
      }
    />
  ));
};

export const HeaderButtons = (props: HeaderButtonsProps) => {
  const { parentComponent, clickHandler } = props;
  return (
    <ButtonsArea>{renderButtons(parentComponent, clickHandler)}</ButtonsArea>
  );
};
