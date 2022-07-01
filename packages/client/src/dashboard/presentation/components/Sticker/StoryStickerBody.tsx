import React from 'react';
import styled from '@emotion/styled';
import { StoryPieChart } from '../Charts/PieChart';
import { StoryLineChart } from '../Charts/LineChart';
import { StoryBarChart } from '../Charts/BarChart';

type contentType = 'Table' | 'PieChart' | 'BarChart' | 'LineChart';

export interface StickerBodyProps {
  content: contentType;
  dataSet?: any;
  colorSet?: any;
  options?: any;
}

const Content = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100% - 3rem);
  width: calc(100% - 1rem);
  padding: 0.5rem;
`;

// TODO(hybae)
// Support other charts and table with dataset in Content component
const contentSwitch = (props: StickerBodyProps) => {
  switch (props.content) {
    case 'Table':
      break;
    case 'PieChart':
      return (
        <StoryPieChart
          data={props.dataSet}
          options={props.options}
        ></StoryPieChart>
      );
    case 'BarChart':
      return (
        <StoryBarChart
          data={props.dataSet}
          options={props.options}
        ></StoryBarChart>
      );
    case 'LineChart':
      return (
        <StoryLineChart
          data={props.dataSet}
          options={props.options}
        ></StoryLineChart>
      );
    default:
      break;
  }
};

export const StoryStickerBody = (props: StickerBodyProps) => {
  return <Content>{contentSwitch(props)}</Content>;
};
