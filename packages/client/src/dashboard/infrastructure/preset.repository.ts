import PresetRepositoryInterface from '../domain/preset/preset.repository.interface';
import PresetType from '../domain/preset/preset.type';
import presetStore from './store/preset.store';
import axios from 'axios';

class PresetRepository implements PresetRepositoryInterface {
  public async getPreset(id: string): Promise<PresetType | null> {
    const preset = await axios
      .get(
        `${process.env.REACT_APP_API_URI}${process.env.REACT_APP_GET_ONE_PRESET}/${id}`,
        {
          withCredentials: true,
        },
      )
      .then((res) => {
        return res.data[0];
      });
    return preset;
  }

  public async setPreset(preset: PresetType): Promise<void> {
    presetStore.setPreset(preset);
  }

  public async addPreset(preset: PresetType): Promise<void> {
    const { id } = preset;
    let isExist = false;
    await axios
      .get(
        `${process.env.REACT_APP_API_URI}${process.env.REACT_APP_GET_ALL_PRESET}`,
        {
          withCredentials: true,
        },
      )
      .then((res) => {
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].id === id) isExist = true;
        }
      });
    if (isExist) {
      await axios.put(
        `${process.env.REACT_APP_API_URI}${process.env.REACT_APP_UPDATE_ONE_PRESET}/${id}`,
        preset,
        {
          withCredentials: true,
        },
      );
    } else {
      await axios.post(
        `${process.env.REACT_APP_API_URI}${process.env.REACT_APP_ADD_PRESET}`,
        preset,
        {
          withCredentials: true,
        },
      );
    }
  }

  public async deletePreset(id: string): Promise<void> {
    await axios
      .delete(
        `${process.env.REACT_APP_API_URI}${process.env.REACT_APP_DELETE_ONE_PRESET}/${id}`,
        {
          withCredentials: true,
        },
      )
      .then((res) => {
        console.log('delete result: ', res);
      });
  }
}

export default new PresetRepository();
