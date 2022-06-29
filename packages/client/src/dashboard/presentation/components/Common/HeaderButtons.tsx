import React from 'react';
import styled from 'styled-components';
import { InvisibleButton } from '../Button/InvisibleButton';

type parentComponentType = 'SECTION' | 'STICKER';

interface HeaderButtonsProps {
  parentComponent: parentComponentType;
}

const ButtonsArea = styled.div``;

const renderButtons = (buttonType: parentComponentType) => {
  const render: any[] = [];
  let renderList = [];
  if (buttonType === 'SECTION') renderList = ['EDIT', 'FILTER', 'CLOSE'];
  else renderList = ['EDIT', 'CLOSE'];
  renderList.map((type, i) => {
    render.push(<InvisibleButton key={i} buttonType={type} />);
  });
  return render;
};

export const HeaderButtons = (props: HeaderButtonsProps) => {
  const { parentComponent } = props;
  return <ButtonsArea>{renderButtons(parentComponent)}</ButtonsArea>;
};
