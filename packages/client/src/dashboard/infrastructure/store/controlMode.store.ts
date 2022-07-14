import zustandStore from './zustand/dashboard.store.zustand';
import ControlModeType from '../../domain/controlMode/controlMode.type';
// ===================== ZUSTAND STORAGE =====================

class ControlModeStore {
  public subscribeToControlMode(
    callback: (controlMode: ControlModeType) => void,
  ) {
    zustandStore.subscribe(() => {
      callback(zustandStore.getState().controlMode);
    });
  }

  public setControlMode(controlMode: ControlModeType) {
    zustandStore.setState({ controlMode: controlMode });
  }

  public getControlMode(): ControlModeType {
    return zustandStore.getState().controlMode;
  }
}

export default new ControlModeStore();
