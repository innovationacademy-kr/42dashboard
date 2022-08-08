import './styles.css';
import './styles2.css';
import Sticker from '../Sticker/Sticker';
import useStickers from '../../../application/services/useStickers';
import useMode from '../../../application/services/useMode';
import RGL, { Layout, WidthProvider } from 'react-grid-layout';
import ModalFrame from '../Modal/Modal';
import { useState, useEffect } from 'react';
import EditToolBar from '../Common/EditToolBar';
import { PeriodFilterType } from '../../../domain/sectionDatas/sectionData.type';
import { TableProps } from '../Table/Table';
import {
  ChartQueryIngredientType,
  TableQueryIngredientType,
} from '../../../application/services/useDataset';
import { ChartProps } from '../Charts/ChartData';

const ReactGridLayout = WidthProvider(RGL.Responsive);

interface SectionProps {
  id: string;
  stickerLayouts: Layout[];
  handleSectionRemove: (sectionId: string) => void;
  handleStickerAdd: (sectionId: string, stickerId: string) => void;
  handleStickerRemove: (sectionId: string, stickerId: string) => void;
  handleStickerLayoutChange: (sectionId: string, newLayout: Layout[]) => void;
  handlePreriodFilterUpdate: (
    sectionId: string,
    periodFilter: PeriodFilterType,
  ) => void;
}

export default function Section(props: SectionProps) {
  const { stickerDatas, addStickerData, removeSticker, updateStickerDatas } =
    useStickers();
  const {
    id,
    stickerLayouts,
    handleSectionRemove,
    handleStickerAdd,
    handleStickerLayoutChange,
    handleStickerRemove,
    handlePreriodFilterUpdate,
  } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [grade, setGrade] = useState<string | undefined>(undefined);
  const { getControlMode } = useMode();

  useEffect(() => {
    handlePreriodFilterUpdate(id, { startDate, endDate, grade });
    const updateTargetStickerDatas = stickerDatas.filter(
      (stickerData) => stickerData.sectionId === id,
    );
    const restOfStickerDatas = stickerDatas.filter(
      (stickerData) => stickerData.sectionId !== id,
    );
    const tableStickerDatas = updateTargetStickerDatas.filter(
      (stickerData) => stickerData.data.type.match(/table/) !== null,
    );

    const chartStickerDatas = updateTargetStickerDatas.filter(
      (stickerData) => stickerData.data.type.match(/(.+Chart)/) !== null,
    );
    tableStickerDatas.forEach((stickerData) => {
      const newProps = stickerData.data.contentProps as TableProps;
      const tableQueryIngredient = newProps.queryData
        .queryIngredient as TableQueryIngredientType;
      // 기간 일경우와 기수일경우 나눠서 로직 실행

      tableQueryIngredient.startDate = startDate;
      tableQueryIngredient.endDate = endDate;
      // grade는 undefined이면, 필터에서 찾아서 제거.
      if (!tableQueryIngredient.filterNames.includes('sectionGradeFilter')) {
        tableQueryIngredient.filterNames.push('sectionGradeFilter');
      }
      if (grade !== undefined) {
        newProps.queryData.filters.sectionGradeFilter = {
          entityName: 'user',
          column: 'grade',
          operator: '=',
          givenValue: grade,
          latest: true,
        };
      } else {
        newProps.queryData.filters.sectionGradeFilter = {
          entityName: 'user',
          column: null,
          operator: null,
          givenValue: null,
          latest: true,
        };
      }
    });
    chartStickerDatas.forEach((stickerData) => {
      const newProps = stickerData.data.contentProps as ChartProps;
      const chartQueryIngredient = newProps.queryData
        .queryIngredient as ChartQueryIngredientType;
      chartQueryIngredient.startDate = startDate;
      chartQueryIngredient.endDate = endDate;
      // grade는 undefined이면, 필터에서 찾아서 제거.
      if (!chartQueryIngredient.filterNames.includes('sectionGradeFilter')) {
        chartQueryIngredient.filterNames.push('sectionGradeFilter');
      }
      chartQueryIngredient.filterSetsPerData.forEach((filterSet) => {
        if (!filterSet.includes('sectionGradeFilter')) {
          filterSet.push('sectionGradeFilter');
        }
      });
      if (grade !== undefined) {
        newProps.queryData.filters.sectionGradeFilter = {
          entityName: 'user',
          column: 'grade',
          operator: '=',
          givenValue: grade,
          latest: true,
        };
      } else {
        newProps.queryData.filters.sectionGradeFilter = {
          entityName: 'user',
          column: null,
          operator: null,
          givenValue: null,
          latest: true,
        };
      }
    });
    updateStickerDatas([
      ...tableStickerDatas,
      ...chartStickerDatas,
      ...restOfStickerDatas,
    ]);
  }, [startDate, endDate, grade]);

  console.log('startDate !!!: ', startDate);
  function drawStickers() {
    return stickerLayouts.map((sticker: Layout, idx) => (
      <div key={sticker.i}>
        {/* TODO(sonkang) : 나중에 더 좋은 방법을 찾아보기 */}
        {stickerDatas[idx] && (
          <Sticker
            id={sticker.i}
            data={stickerDatas[idx].data}
            handleStickerRemove={(stickerId) => {
              removeSticker(stickerId);
              handleStickerRemove(id, stickerId);
            }}
          />
        )}
      </div>
    ));
  }
  const periodFilter: PeriodFilterType = { startDate, endDate, grade };
  return (
    <>
      {getControlMode() === 'edit' && (
        <EditToolBar
          type="Section"
          setIsOpen={setIsOpen}
          removeItem={handleSectionRemove}
          id={id}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          setGrade={setGrade}
          periodFilter={periodFilter}
        />
      )}
      <ModalFrame
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        sectionId={id}
        renderAddedSticker={handleStickerAdd}
        addStickerData={addStickerData}
        startDate={startDate}
        endDate={endDate}
      ></ModalFrame>
      <ReactGridLayout
        onDragStart={(a, b, c, d, e) => e.stopPropagation()}
        layouts={{ lg: stickerLayouts }}
        breakpoints={{ lg: 600 }}
        cols={{ lg: 8, md: 5, sm: 4, xs: 2, xxs: 1 }}
        onLayoutChange={(newLayout) => {
          handleStickerLayoutChange(id, newLayout);
        }}
        className="layout"
        rowHeight={30}
      >
        {drawStickers()}
      </ReactGridLayout>
    </>
  );
}
