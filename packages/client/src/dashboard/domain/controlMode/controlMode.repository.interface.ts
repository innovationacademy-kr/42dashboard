import ControlModeType from './controlMode.type';

interface ControlModeRepositoryInterface {
  getControlMode(): string;
  setControlMode(controlMode: ControlModeType): Promise<void>;
}

export default ControlModeRepositoryInterface;
