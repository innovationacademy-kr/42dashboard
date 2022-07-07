import React from 'react';
import styled from '@emotion/styled';
import { Header } from '../Common/Header';
import { StickerBody } from './StickerBody';
import { DocumentNode } from '@apollo/client';

type contentType = 'Table' | 'PieChart' | 'BarChart' | 'LineChart';

interface StickerProps {
  content: contentType;
  query: DocumentNode;
  filters: object;
  clickHandler: () => void;
}

const StickerWrapper = styled.div`
  height: 100%;
`;

export const Sticker = ({
  content,
  query,
  clickHandler,
  filters,
}: StickerProps) => {
  return (
    <StickerWrapper>
      <Header parentComponent="STICKER" clickHandler={clickHandler}></Header>
      <StickerBody
        content={content}
        query={query}
        filters={filters}
      ></StickerBody>
    </StickerWrapper>
  );
};
