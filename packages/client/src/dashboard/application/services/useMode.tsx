import { useState } from 'react';
import ControlModeService from '../../domain/controlMode/controlMode.service';
import ControlModeType from '../../domain/controlMode/controlMode.type';
import ControlModeRepository from '../../infrastructure/controlMode.repository';
import ControlModeStore from '../../infrastructure/store/controlMode.store';

const controlModeService = new ControlModeService(ControlModeRepository);

function useMode() {
  const [controlModeData, setcontrolModeData] = useState(
    ControlModeStore.getControlMode(),
  );

  ControlModeStore.subscribeToControlMode(
    (newControlModeData: ControlModeType) => {
      setcontrolModeData(newControlModeData);
    },
  );

  const getControlMode = () => {
    return controlModeService.getControlMode();
  };

  const setControlMode = async (mode: ControlModeType) => {
    return await controlModeService.setControlMode(mode);
  };

  return { controlModeData, getControlMode, setControlMode };
}

export const getControlMode = () => {
  return controlModeService.getControlMode();
};
export default useMode;
