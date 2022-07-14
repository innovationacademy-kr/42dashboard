import PresetRepositoryInterface from './preset.repository.interface';
import PresetType from './preset.type';

class PresetService {
  constructor(protected presetRepository: PresetRepositoryInterface) {}

  public async getPreset(): Promise<PresetType | null> {
    return this.presetRepository.getPreset();
  }

  public async setPreset(preset: PresetType): Promise<void> {
    return this.presetRepository.setPreset(preset);
  }

  // deletePreset(id: string): Promise<void> {
  //   return this.presetRepository.deletePreset(id);
  // }
}

export default PresetService;
