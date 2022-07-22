import zustandStore from './zustand/dashboard.store.zustand';
import PresetListType from '../../domain/presetList/presetList.type';

// ===================== ZUSTAND STORAGE =====================
class PresetListStore {
  public subscribeToPresetList(callback: (presetList: PresetListType) => void) {
    zustandStore.subscribe(() => {
      callback(zustandStore.getState().presetList);
    });
  }

  public setPresetList(presetList: PresetListType) {
    zustandStore.setState({ presetList: presetList });
  }

  public getPresetList(): PresetListType {
    return zustandStore.getState().presetList;
  }
}

export default new PresetListStore();
