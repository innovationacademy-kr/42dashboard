import StickerContentFactory, {
  StickerContentFactoryProps,
} from './StickerContentFactory';
import { Button } from '@mui/material';

interface StickerProps {
  id: string;
  data: StickerContentFactoryProps;
  handleStickerRemove: (id: string) => void;
}

function Sticker(props: StickerProps) {
  const { id, data, handleStickerRemove } = props;

  return (
    <>
      <Button onClick={() => handleStickerRemove(id)}>Remove Sticker</Button>
      <StickerContentFactory
        type={data.type}
        contentProps={data.contentProps}
      />
    </>
  );
}

export default Sticker;
