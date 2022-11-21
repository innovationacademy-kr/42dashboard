import PresetRepositoryInterface from '../domain/preset/preset.repository.interface';
import PresetType from '../domain/preset/preset.type';
import presetStore from './store/preset.store';
import {
  axiosGetOnePreset,
  axiosGetAllPreset,
  axiosUpdatePreset,
  axiosAddPreset,
  axiosDeletePreset,
} from './http/axios/axios.custom';
class PresetRepository implements PresetRepositoryInterface {
  public async getPreset(id: string): Promise<PresetType | null> {
    const preset = await axiosGetOnePreset(id).then((res) => {
      console.log('get result from db', res);
      return res.data[0];
    });
    return preset;
  }

  public setPreset(preset: PresetType): void {
    presetStore.setPreset(preset);
  }

  public async savePreset(preset: PresetType): Promise<void> {
    const { id } = preset;
    let isExist = false;
    await axiosGetAllPreset().then((res) => {
      for (let i = 0; i < res.data.length; i++) {
        if (res.data[i].id === id) isExist = true;
      }
    });
    if (isExist) {
      await axiosUpdatePreset(id, preset);
    }
    if (!isExist) {
      await axiosAddPreset(preset);
    }
  }

  public async deletePreset(id: string): Promise<void> {
    await axiosDeletePreset(id);
  }
}

export default new PresetRepository();
