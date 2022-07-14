import React, { Key } from 'react';
import styled from '@emotion/styled';
import { Header } from '../Common/Header';
import { StickerBody } from './StickerBody';
import StickerContentFactory from './StickerContentFactory';
import { Button } from '@mui/material';
import useStickers from '../../../application/services/useStickers';

interface StickerProps {
  key: Key;
}

function Sticker(props: StickerProps) {
  const { key } = props;
  const { getSticker, removeSticker } = useStickers();
  const { data } = getSticker(key as string);
  const { type, contentProps } = data;
  console.log('보자', data);
  return (
    <>
      <Button onClick={() => removeSticker(key as string)}>
        Remove Sticker
      </Button>
      <StickerContentFactory type={type} contentProps={contentProps} />
    </>
  );
}

// type contentType = 'Table' | 'PieChart' | 'BarChart' | 'LineChart';

// interface StickerProps {
//   content: contentType;
//   clickHandler: () => void;
// }

// const StickerWrapper = styled.div`
//   height: 100%;
// `;

// export const Sticker = (props: StickerProps) => {
//   const { content, clickHandler } = props;
//   return (
//     <StickerWrapper>
//       <Header parentComponent="STICKER" clickHandler={clickHandler}></Header>
//       <StickerBody content={content}></StickerBody>
//     </StickerWrapper>
//   );
// };

export default Sticker;
