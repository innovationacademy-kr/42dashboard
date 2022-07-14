import ControlModeType from './controlMode.type';

interface ControlModeRepositoryInterface {
  getControlMode(): Promise<ControlModeType>;
  setControlMode(controlMode: ControlModeType): Promise<void>;
}

export default ControlModeRepositoryInterface;
