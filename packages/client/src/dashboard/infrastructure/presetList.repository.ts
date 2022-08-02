import PresetType, { PresetInfoType } from './../domain/preset/preset.type';
import PresetListRepositoryInterface from '../domain/presetList/presetList.repository.interface';
import PresetListType from '../domain/presetList/presetList.type';
import presetlistStore from './store/presetList.store';

class PresetListRepository implements PresetListRepositoryInterface {
  public async getPresetList(): Promise<PresetListType> {
    // 여기가 http로 Preset List 받아오는거
    const presetInfos = Array<PresetInfoType>();

    for (let i = 0; i < localStorage.length; ++i) {
      const key = localStorage.key(i);
      if (key && key.includes('preset')) {
        const preset = JSON.parse(localStorage.getItem(key)!) as PresetType;
        presetInfos.push(preset.info);
      }
    }
    return { presetInfos };
  }

  public async setPresetList(presetList: PresetListType): Promise<void> {
    presetlistStore.setPresetList(presetList);
  }
}

export default new PresetListRepository();
