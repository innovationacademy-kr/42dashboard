import PresetType from './preset.type';

interface PresetRepositoryInterface {
  getPreset(id: string): Promise<PresetType | null>;
  setPreset(preset: PresetType): Promise<void>;
  savePreset(preset: PresetType): Promise<void>;
  deletePreset(id: string): Promise<void>;
}

export default PresetRepositoryInterface;
