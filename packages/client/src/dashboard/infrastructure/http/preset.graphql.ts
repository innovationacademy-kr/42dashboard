import PresetType from '../../domain/preset/preset.type';

const mockPresets: PresetType[] = [
  {
    id: '1',
    title: 'Preset 1',
    description: 'This is preset 1',
    data: {
      layouts: [
        {
          i: 'blue-eyes-dragon',
          x: 0,
          y: 0,
          w: 1,
          h: 1,
        },
        { i: 'dark-magician', x: 1, y: 0, w: 1, h: 1 },
      ],
    },
  },
];

class PresetHttp {
  // 이 API가 준비되면 이 함수를 수정합니다.
  async getPresets(): Promise<PresetType[]> {
    return mockPresets;
  }
}

export default new PresetHttp();
