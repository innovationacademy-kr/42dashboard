import PresetRepositoryInterface from '../domain/preset/preset.repository.interface';
import PresetType from '../domain/preset/preset.type';
import presetStore from './store/preset.store';
import axios from 'axios';

class PresetRepository implements PresetRepositoryInterface {
  public async getPreset(id: string): Promise<PresetType | null> {
    const preset = await axios
      .get(`http://localhost:3000/user-information/getOnePreSet/${id}`, {
        withCredentials: true,
      })
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
      .get('http://localhost:3000/user-information/getAllPreSet', {
        withCredentials: true,
      })
      .then((res) => {
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].id === id) isExist = true;
        }
      });
    if (isExist) {
      await axios.put(
        `http://localhost:3000/user-information/updateOnePreSet/${id}`,
        preset,
        {
          withCredentials: true,
        },
      );
    } else {
      await axios.post(
        'http://localhost:3000/user-information/addPreSet',
        preset,
        {
          withCredentials: true,
        },
      );
    }
  }

  public async deletePreset(id: string): Promise<void> {
    await axios
      .delete(`http://localhost:3000/user-information/deleteOnePreset/${id}`, {
        withCredentials: true,
      })
      .then((res) => {
        console.log('delete result: ', res);
      });
  }
}

export default new PresetRepository();
