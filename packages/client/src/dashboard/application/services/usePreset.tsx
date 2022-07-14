import { useState } from 'react';
import PresetService from '../../domain/preset/preset.service';
import PresetType from '../../domain/preset/preset.type';
import presetRepository from '../../infrastructure/preset.repository';
import presetStore from '../../infrastructure/store/preset.store';

const presetService = new PresetService(presetRepository);

function usePreset() {
  const [preset, setPreset] = useState(presetStore.getPreset());

  presetStore.subscribeToPreset((preset: PresetType | null) => {
    setPreset(preset);
  });

  const getPreset = async () => {
    return await presetService.getPreset();
  };

  const changePreset = async (to: PresetType) => {
    return await presetService.setPreset(to);
  };

  return { preset, getPreset, changePreset };
}

export default usePreset;
