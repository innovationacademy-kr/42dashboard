import { useEffect, useState } from 'react';
import PresetService from '../../domain/preset/preset.service';
import PresetType from '../../domain/preset/preset.type';
import PresetListType from '../../domain/presetList/presetList.type';
import presetRepository from '../../infrastructure/preset.repository';
import boardDataStore from '../../infrastructure/store/boardData.store';
import presetStore from '../../infrastructure/store/preset.store';
import presetListStore from '../../infrastructure/store/presetList.store';
import sectionDatasStore from '../../infrastructure/store/sectionDatas.store';
import stickerDatasStore from '../../infrastructure/store/stickerDatas.store';
import { v4 as uuid } from 'uuid';
import { Layout } from 'react-grid-layout';
import SectionDataType from '../../domain/sectionDatas/sectionData.type';
import StickerDataType from '../../domain/stickerDatas/stickerData.type';
import presetListRepository from '../../infrastructure/presetList.repository';
import PresetListService from '../../domain/presetList/presetList.service';
import useMode from '../../application/services/useMode';

const presetService = new PresetService(presetRepository);
const presetListService = new PresetListService(presetListRepository);

function usePreset() {
  const { setControlMode } = useMode();

  const [preset, setPreset] = useState<PresetType | null>(
    presetStore.getPreset(),
  );

  presetStore.subscribeToPreset((preset: PresetType | null) => {
    setPreset(preset);
  });

  const [presetList, setPresetList] = useState<PresetListType>({
    presetInfos: [],
  });

  presetListStore.subscribeToPresetList((newPresetList: PresetListType) => {
    setPresetList(newPresetList);
  });

  useEffect(() => {
    const fetchPresetList = async () => {
      const presetList = await presetListService.getPresetList();
      if (presetList.presetInfos.length !== 0) {
        presetListStore.setPresetList(presetList);
        changePreset(presetList.presetInfos[0].id);
      } else {
        createPreset();
        setControlMode('edit');
      }
    };
    fetchPresetList();
  }, []);

  useEffect(() => {
    if (preset) {
      boardDataStore.setBoardData(preset.data.boardData);
      sectionDatasStore.setSectionDatas(preset.data.sectionDatas);
      stickerDatasStore.setStickerDatas(preset.data.stickerDatas);
    }
  }, [preset]);

  // Board, Section, Sticker 데이터 스토어를 업데이트 해준다.
  const changePreset = async (id: string) => {
    const presetData = await presetService.getPreset(id);
    if (presetData) {
      return presetService.setPreset(presetData);
    }
  };

  const createPreset = () => {
    const newPresetData = {
      id: uuid(),
      data: {
        boardData: {
          sectionIds: Array<string>(),
          sectionLayouts: Array<Layout>(),
        },
        sectionDatas: Array<SectionDataType>(),
        stickerDatas: Array<StickerDataType>(),
      },
    };
    const newPresetInfo = {
      id: newPresetData.id,
      label: '새 프리셋',
      description: '프리셋 설명',
    };
    presetStore.setPreset({
      id: newPresetData.id,
      data: newPresetData.data,
      info: newPresetInfo,
    });
    presetListStore.setPresetList({
      presetInfos: [...presetList.presetInfos, newPresetInfo],
    });
  };

  const changePresetLabel = async (id: string, label: string) => {
    const presetData = await presetService.getPreset(id);
    if (presetData && presetList) {
      const newPresetInfoList = presetList.presetInfos.filter(
        (presetInfo) => presetInfo.id !== id,
      );
      const newPresetInfo = {
        id: id,
        label: label,
        description: '프리셋 설명',
      };
      presetStore.setPreset({
        id: id,
        data: presetData.data,
        info: newPresetInfo,
      });
      presetListStore.setPresetList({
        presetInfos: [newPresetInfo, ...newPresetInfoList],
      });
    }
  };
  return { preset, presetList, createPreset, changePreset, changePresetLabel };
}

export default usePreset;
