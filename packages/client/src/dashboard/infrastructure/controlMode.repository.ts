import ControlModeRepositoryInterface from '../domain/controlMode/controlMode.repository.interface';
import ControlModeType from '../domain/controlMode/controlMode.type';
import controlModeStore from './store/controlMode.store';

class ControlModeRepository implements ControlModeRepositoryInterface {
  public getControlMode(): string {
    return controlModeStore.getControlMode();
  }

  public async setControlMode(controlMode: ControlModeType): Promise<void> {
    controlModeStore.setControlMode(controlMode);
  }
}

export default new ControlModeRepository();
