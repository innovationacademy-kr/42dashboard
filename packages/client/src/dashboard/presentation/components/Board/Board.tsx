import './styles.css';
import './styles2.css';
import RGL, { WidthProvider } from 'react-grid-layout';
import Section from './Section';
import usePreset from '../../../application/services/usePreset';
import PresetType from '../../../domain/preset/preset.type';
import useBoardLayout, {
  NestedLayout,
} from '../../../application/services/useBoardLayout';
import ModalFrame from '../Modal/Modal';
import TestComponent from '../Modal/TestComponent';
import useFiltersModal from '../../../application/services/useFiltersModal';

const ReactGridLayout = WidthProvider(RGL.Responsive);

export interface BoardProps {
  preset: PresetType;
}

export default function Board() {
  const {
    sectionLayout,
    handleSectionAdd,
    handleSectionLayoutChange,
    handleStickerLayoutChange,
    handleSectionRemove,
  } = useBoardLayout();

  const { isOpen, openFiltersModal, applyFiltersModal, cancelFiltersModal } =
    useFiltersModal();

  const { preset, getPreset, changePreset } = usePreset();

  function drawSections() {
    return sectionLayout.map((section: NestedLayout) => {
      return (
        <div key={section.i}>
          <Section key={section.i} />
        </div>
      );
    });
  }

  return (
    <>
      <button onClick={() => openFiltersModal()}>OPEN</button>
      <ModalFrame contents={TestComponent}></ModalFrame>
      <button onClick={handleSectionAdd}>Add Section Item</button>
      <ReactGridLayout
        onDragStart={(a, b, c, d, e) => e.stopPropagation()}
        layouts={{ lg: sectionLayout }}
        breakpoints={{ lg: 600, md: 498, sm: 384, xs: 240, xxs: 0 }}
        cols={{ lg: 8, md: 5, sm: 4, xs: 2, xxs: 1 }}
        onLayoutChange={handleSectionLayoutChange}
        className="layout"
        rowHeight={30}
      >
        {drawSections()}
      </ReactGridLayout>
    </>
  );
}
