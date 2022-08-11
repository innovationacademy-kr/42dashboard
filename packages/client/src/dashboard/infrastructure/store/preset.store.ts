import zustandStore from './zustand/dashboard.store.zustand';
import PresetType from '../../domain/preset/preset.type';

// ===================== ZUSTAND STORAGE =====================
class PresetStore {
  public subscribeToPreset(callback: (preset: PresetType | null) => void) {
    zustandStore.subscribe(() => {
      callback(zustandStore.getState().preset);
    });
  }

  public setPreset(preset: PresetType) {
    console.log('setPreset in memory', preset);
    zustandStore.setState({ preset });
  }

  public getPreset(): PresetType | null {
    return zustandStore.getState().preset;
  }
}

export default new PresetStore();
