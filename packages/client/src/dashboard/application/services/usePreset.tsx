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
import controlModeStore from '../../infrastructure/store/controlMode.store';

const presetService = new PresetService(presetRepository);
const presetListService = new PresetListService(presetListRepository);

function usePreset() {
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
    async function fetchPresetList() {
      // from db
      const presetList = await presetListService.getPresetList(); // from db
      // if no presetLiset, create one
      if (presetList.presetInfos.length !== 0) {
        presetListStore.setPresetList(presetList);
        await changePreset(presetList.presetInfos[0].id);
      } else {
        createPreset();
      }
    }
    fetchPresetList();
  }, []);

  useEffect(() => {
    // update board, section, sticker datas in memory
    if (preset && preset.data) {
      boardDataStore.setBoardData(preset.data.boardData);
      sectionDatasStore.setSectionDatas(preset.data.sectionDatas);
      stickerDatasStore.setStickerDatas(preset.data.stickerDatas);
    }
  }, [preset]);

  // Board, Section, Sticker 데이터 스토어를 업데이트 해준다.
  const changePreset = async (id: string) => {
    const presetData = await presetService.getPreset(id);
    if (presetData) {
      return await presetService.setPreset(presetData);
    }
  };

  const changePresetList = async (presetList: PresetListType) => {
    await presetListService.setPresetList(presetList);
  };

  const createPreset = async () => {
    const newPresetId = uuid();
    const newPreset = {
      id: newPresetId,
      data: {
        boardData: {
          sectionIds: Array<string>(),
          sectionLayouts: Array<Layout>(),
        },
        sectionDatas: Array<SectionDataType>(),
        stickerDatas: Array<StickerDataType>(),
      },
      info: {
        id: newPresetId,
        label: '새 프리셋',
        description: '프리셋 설명',
      },
    };

    // update preset store state
    presetService.setPreset({
      id: newPresetId,
      data: newPreset.data,
      info: newPreset.info,
    });

    // save preset to db
    await presetService.savePreset(newPreset);

    console.log('create preset', newPreset);

    // add to prestList in memory
    presetListStore.setPresetList({
      presetInfos: [...presetList.presetInfos, newPreset.info],
    });
    console.log('createPreset', presetList); // 적용안됨.
    controlModeStore.setControlMode('edit');
  };

  const removePreset = async (id: string) => {
    await presetService.deletePreset(id);
  };

  // 해당 아이디의 info의 라벨을 수정한다.
  const changePresetLabel = async (id: string, label: string) => {
    const presetData = await presetService.getPreset(id); // from db
    if (presetData && presetList) {
      //create new preset Info
      const newPresetInfo = {
        ...presetData.info,
        label,
      };

      // update preset db state
      await presetService.setPreset({ ...presetData, info: newPresetInfo });

      // create updated presetInfoList
      const newPresetInfos = presetList.presetInfos.map((info) => {
        if (info.id === id) return newPresetInfo;
        return info;
      });

      // add to prestList in memory
      presetListStore.setPresetList({
        presetInfos: newPresetInfos,
      });
    }
  };
  return {
    preset,
    presetList,
    changePresetList,
    createPreset,
    changePreset,
    removePreset,
    changePresetLabel,
  };
}

export default usePreset;
