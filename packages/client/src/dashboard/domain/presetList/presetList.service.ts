import PresetListRepositoryInterface from './presetList.repository.interface';
import PresetListType from './presetList.type';

class PresetListService {
  constructor(protected presetListRepository: PresetListRepositoryInterface) {}

  public async getPresetList(): Promise<PresetListType> {
    return await this.presetListRepository.getPresetList();
  }

  public setPresetList(presetList: PresetListType): void {
    return this.presetListRepository.setPresetList(presetList);
  }
}

export default PresetListService;
