import React from 'react';
import styled from '@emotion/styled';
import { Header } from '../Common/Header';
import { StickerBody } from './StickerBody';

type contentType = 'Table' | 'PieChart' | 'BarChart' | 'LineChart';

interface StickerProps {
  content: contentType;
  clickHandler: () => void;
}

const StickerWrapper = styled.div`
  height: 100%;
`;

export const Sticker = (props: StickerProps) => {
  const { content, clickHandler } = props;
  return (
    <StickerWrapper>
      <Header parentComponent="STICKER" clickHandler={clickHandler}></Header>
      <StickerBody content={content}></StickerBody>
    </StickerWrapper>
  );
};
