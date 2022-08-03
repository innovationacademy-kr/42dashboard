import PresetType, { PresetInfoType } from './../domain/preset/preset.type';
import PresetListRepositoryInterface from '../domain/presetList/presetList.repository.interface';
import PresetListType from '../domain/presetList/presetList.type';
import presetlistStore from './store/presetList.store';
import axios from 'axios';

class PresetListRepository implements PresetListRepositoryInterface {
  public async getPresetList(): Promise<PresetListType> {
    const presetInfos = Array<PresetInfoType>();

    await axios
      .get('http://localhost:3000/user-information/getAllPreSet', {
        withCredentials: true,
      })
      .then((res) => {
        for (let i = 0; i < res.data.length; i++) {
          presetInfos.push(res.data[i].info);
        }
      });
    return { presetInfos };
  }

  public async setPresetList(presetList: PresetListType): Promise<void> {
    presetlistStore.setPresetList(presetList);
  }
}

export default new PresetListRepository();
