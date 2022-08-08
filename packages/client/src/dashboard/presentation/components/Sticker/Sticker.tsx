import StickerContentFactory, {
  StickerContentFactoryProps,
} from './StickerContentFactory';
import useMode from '../../../application/services/useMode';
import EditToolBar from '../Common/EditToolBar';
import { Card } from '@mui/material';

interface StickerProps {
  id: string;
  data: StickerContentFactoryProps;
  handleStickerRemove: (id: string) => void;
}

function Sticker(props: StickerProps) {
  const { id, data, handleStickerRemove } = props;
  const { getControlMode } = useMode();
  return (
    <Card>
      {getControlMode() === 'edit' && (
        <EditToolBar type="Sticker" removeItem={handleStickerRemove} id={id} />
      )}
      <StickerContentFactory
        type={data.type}
        contentProps={data.contentProps}
      />
    </Card>
  );
}

export default Sticker;
