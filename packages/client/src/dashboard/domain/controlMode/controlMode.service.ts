import ControlModeRepositoryInterface from './controlMode.repository.interface';
import ControlModeType from './controlMode.type';

class ControlModeService {
  constructor(
    protected controlModeRepository: ControlModeRepositoryInterface,
  ) {}

  public getControlMode(): string {
    return this.controlModeRepository.getControlMode();
  }

  public async setControlMode(controlMode: ControlModeType): Promise<void> {
    return this.controlModeRepository.setControlMode(controlMode);
  }
}

export default ControlModeService;
