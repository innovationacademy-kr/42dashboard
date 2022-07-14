import React, { Key } from 'react';
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

export default Sticker;
