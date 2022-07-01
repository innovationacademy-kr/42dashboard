import React from 'react';
import styled from '@emotion/styled';
import { HeaderTitle } from './HeaderTitle';
import { HeaderButtons } from './HeaderButtons';

type parentComponentType = 'SECTION' | 'STICKER';

interface HeaderProps {
  parentComponent: parentComponentType;
  clickHandler: () => void;
}

const HeaderArea = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-left: 1rem;
  height: 2rem;
  background-color: lightgrey;
`;

// TODO(hybae)
// Support title prop to Button component
export const Header = (props: HeaderProps) => {
  const { parentComponent, clickHandler } = props;
  const title = null;
  return (
    <div>
      <HeaderArea>
        <HeaderTitle title={title || 'My Title'} />
        <HeaderButtons
          parentComponent={parentComponent}
          clickHandler={clickHandler}
        />
      </HeaderArea>
    </div>
  );
};
