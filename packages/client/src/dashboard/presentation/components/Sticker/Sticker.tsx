import StickerContentFactory, {
  StickerContentFactoryProps,
} from './StickerContentFactory';
import { getControlMode } from '../../../application/services/useMode';
import { StickerEditToolBar } from '../Common/EditToolBar';
import { useRef, useState } from 'react';
import ConfigModal from '../Modal/ConfigModal';
import html2canvas from 'html2canvas';

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

  const element = useRef(null);

  const onHtmlToPng = () => {
    html2canvas(element.current!).then((canvas) => {
      onSaveAs(canvas.toDataURL('image/png'), 'image-download.png');
    });
  };

  const onSaveAs = (uri: string, filename: string) => {
    const link = document.createElement('a');
    document.body.appendChild(link);
    link.href = uri;
    link.download = filename;
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      {getControlMode() === 'edit' && (
        <StickerEditToolBar
          data={data}
          handelStickerRemove={handleStickerRemove}
          stickerId={id}
          isConfigOpen={isConfigOpen}
          setIsConfigOpen={setIsConfigOpen}
          onHtmlToPng={onHtmlToPng}
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
        <div style={{ width: '100%', height: '100%' }} ref={element}>
          <StickerContentFactory
            type={data.type}
            contentProps={data.contentProps}
          />
        </div>
      )}
    </>
  );
}

export default Sticker;
