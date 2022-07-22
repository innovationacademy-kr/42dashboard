import PresetRepositoryInterface from '../domain/preset/preset.repository.interface';
import PresetType from '../domain/preset/preset.type';
import presetStore from './store/preset.store';

class PresetRepository implements PresetRepositoryInterface {
  public async getPreset(id: string): Promise<PresetType | null> {
    //여기가 http로 Preset Type 받아오는거
    const preset = localStorage.getItem(`preset-${id}`);
    return preset ? (JSON.parse(preset) as PresetType) : null;
  }

  public async setPreset(preset: PresetType): Promise<void> {
    presetStore.setPreset(preset);
  }

  public async addPreset(preset: PresetType): Promise<void> {
    //graphQl로 프리셋 데이터 저장
    const { id } = preset;
    localStorage.setItem(`preset-${id}`, JSON.stringify(preset));
  }
}

export default new PresetRepository();
