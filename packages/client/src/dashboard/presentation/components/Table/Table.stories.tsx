import { TableProps } from '@mui/material';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { createQueryForTable } from '../../../infrastructure/http/graphql/createQuery';
import { TableStickerContent } from './Table';

export default {
  title: 'Table',
  component: TableStickerContent,
} as ComponentMeta<typeof TableStickerContent>;

const Template: ComponentStory<typeof TableStickerContent> = (args) => (
  <TableStickerContent {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  columnGroups: [
    { id: 'user', colSpan: 3, label: '기본 정보' },
    { id: 'personal', colSpan: 2, label: '개인 정보' },
  ],
  columns: [
    { id: 'intraNo', label: '인트라 No.' },
    { id: 'name', label: '이름' },
    { id: 'grade', label: '기수' },
    { id: 'age', label: '나이' },
    { id: 'gender', label: '성별' },
  ],
  queryData: {
    query: createQueryForTable(
      ['personalData'],
      ['intra_no', 'name', 'grade', 'userPersonalInformation {age, gender}'],
    ),
    filters: {
      personalData: {
        entityName: 'userPersonalInformation',
        column: null,
        operator: null,
        givenValue: null,
        latest: true,
      },
    },
  },
};
