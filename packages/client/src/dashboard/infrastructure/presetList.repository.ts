import { PresetInfoType } from './../domain/preset/preset.type';
import PresetListRepositoryInterface from '../domain/presetList/presetList.repository.interface';
import PresetListType from '../domain/presetList/presetList.type';
import presetlistStore from './store/presetList.store';
import { axiosGetAllPreset } from './http/axios/axios.custom';

class PresetListRepository implements PresetListRepositoryInterface {
  public async getPresetList(): Promise<PresetListType> {
    const presetInfos: PresetInfoType[] = [];

    await axiosGetAllPreset().then((res) => {
      for (let i = 0; i < res.data.length; i++) {
        presetInfos.push(res.data[i].info);
      }
    });
    console.log('presetList: from db', presetInfos);
    return { presetInfos };
  }

  public setPresetList(presetList: PresetListType) {
    console.log('setList in memory', presetList);
    presetlistStore.setPresetList(presetList);
  }
}

export default new PresetListRepository();
