import StickerContentFactory, {
  StickerContentFactoryProps,
} from './StickerContentFactory';
import useMode from '../../../application/services/useMode';
import { Button } from '@mui/material';
import EditToolBar from '../Common/EditToolBar';

interface StickerProps {
  id: string;
  data: StickerContentFactoryProps;
  handleStickerRemove: (id: string) => void;
}

function Sticker(props: StickerProps) {
  const { id, data, handleStickerRemove } = props;
  const { getControlMode } = useMode();
  return (
    <>
      {getControlMode() === 'edit' && (
        <EditToolBar type="Sticker" removeItem={handleStickerRemove} id={id} />
      )}
      <StickerContentFactory
        type={data.type}
        contentProps={data.contentProps}
      />
    </>
  );
}

export default Sticker;
