import React from 'react';
import styled from 'styled-components';
import { HeaderTitle } from './HeaderTitle';
import { HeaderButtons } from './HeaderButtons';

type parentComponentType = 'SECTION' | 'STICKER';

interface HeaderProps {
  parentComponent: parentComponentType;
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

// TODO
// title을 직접 적용할 수 있도록 수정
export const Header = (props: HeaderProps) => {
  const { parentComponent } = props;
  // 임시 타이틀
  const title = 'TITLE';
  return (
    <div>
      <HeaderArea>
        <HeaderTitle title={title} />
        <HeaderButtons parentComponent={parentComponent} />
      </HeaderArea>
    </div>
  );
};
