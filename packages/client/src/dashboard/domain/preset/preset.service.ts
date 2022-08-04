import PresetRepositoryInterface from './preset.repository.interface';
import PresetType from './preset.type';

class PresetService {
  constructor(protected presetRepository: PresetRepositoryInterface) {}

  public async getPreset(id: string): Promise<PresetType | null> {
    return this.presetRepository.getPreset(id);
  }

  public async setPreset(preset: PresetType): Promise<void> {
    return this.presetRepository.setPreset(preset);
  }

  public async addPreset(preset: PresetType): Promise<void> {
    return this.presetRepository.addPreset(preset);
  }

  public async deletePreset(id: string): Promise<void> {
    return this.presetRepository.deletePreset(id);
  }
}

export default PresetService;
