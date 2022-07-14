import PresetRepositoryInterface from '../domain/preset/preset.repository.interface';
import PresetType from '../domain/preset/preset.type';
import presetStore from './store/preset.store';

class PresetRepository implements PresetRepositoryInterface {
  public async getPreset(): Promise<PresetType | null> {
    return presetStore.getPreset();
  }

  public async setPreset(preset: PresetType): Promise<void> {
    presetStore.setPreset(preset);
  }
}

export default new PresetRepository();
