import PresetRepositoryInterface from './preset.repository.interface';
import PresetType from './preset.type';

class PresetService {
  constructor(protected presetRepository: PresetRepositoryInterface) {}

  public async getPreset(id: string): Promise<PresetType | null> {
    return await this.presetRepository.getPreset(id);
  }

  public setPreset(preset: PresetType): void {
    return this.presetRepository.setPreset(preset);
  }

  public async savePreset(preset: PresetType): Promise<void> {
    return await this.presetRepository.savePreset(preset);
  }

  public async deletePreset(id: string): Promise<void> {
    return await this.presetRepository.deletePreset(id);
  }
}

export default PresetService;
