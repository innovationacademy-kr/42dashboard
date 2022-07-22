import PresetListRepositoryInterface from './presetList.repository.interface';
import PresetListType from './presetList.type';

class PresetListService {
  constructor(protected presetListRepository: PresetListRepositoryInterface) {}

  public async getPresetList(): Promise<PresetListType> {
    return this.presetListRepository.getPresetList();
  }

  public async setPresetList(presetList: PresetListType): Promise<void> {
    return this.presetListRepository.setPresetList(presetList);
  }
}

export default PresetListService;
