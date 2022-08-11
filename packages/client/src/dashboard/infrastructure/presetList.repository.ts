import { PresetInfoType } from './../domain/preset/preset.type';
import PresetListRepositoryInterface from '../domain/presetList/presetList.repository.interface';
import PresetListType from '../domain/presetList/presetList.type';
import presetlistStore from './store/presetList.store';
import axios from 'axios';

class PresetListRepository implements PresetListRepositoryInterface {
  public async getPresetList(): Promise<PresetListType> {
    const presetInfos: PresetInfoType[] = [];

    await axios
      .get(
        `${process.env.REACT_APP_API_URI}${process.env.REACT_APP_GET_ALL_PRESET}`,
        {
          withCredentials: true,
        },
      )
      .then((res) => {
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
