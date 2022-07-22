import PresetListType from './presetList.type';

interface PresetListRepositoryInterface {
  getPresetList: () => Promise<PresetListType>;
  setPresetList: (presetList: PresetListType) => void;
}

export default PresetListRepositoryInterface;
