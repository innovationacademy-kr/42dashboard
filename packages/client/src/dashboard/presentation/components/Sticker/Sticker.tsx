import StickerContentFactory, {
  StickerContentFactoryProps,
} from './StickerContentFactory';
import { getControlMode } from '../../../application/services/useMode';
import { StickerEditToolBar } from '../Common/EditToolBar';
import { useState } from 'react';
import ConfigModal from '../Modal/ConfigModal';

interface StickerProps {
  id: string;
  data: StickerContentFactoryProps;
  handleStickerRemove: (id: string) => void;
  handleStickerUpdate: (
    stickerId: string,
    stickerData: StickerContentFactoryProps,
  ) => void;
}

function Sticker(props: StickerProps) {
  const { id, data, handleStickerRemove, handleStickerUpdate } = props;
  const [isConfigOpen, setIsConfigOpen] = useState<boolean>(false);

  return (
    <>
      {getControlMode() === 'edit' && (
        <StickerEditToolBar
          data={data}
          handelStickerRemove={handleStickerRemove}
          stickerId={id}
          isConfigOpen={isConfigOpen}
          setIsConfigOpen={setIsConfigOpen}
        />
      )}
      {isConfigOpen ? (
        <ConfigModal
          isOpen={isConfigOpen}
          setIsOpen={setIsConfigOpen}
          stickerId={id}
          stickerFactoryData={data}
          handleStickerUpdate={handleStickerUpdate}
        />
      ) : (
        <StickerContentFactory
          type={data.type}
          contentProps={data.contentProps}
        />
      )}
    </>
  );
}

export default Sticker;
