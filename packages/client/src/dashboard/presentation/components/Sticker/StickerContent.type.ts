import {
  BarControllerChartOptions,
  ChartData,
  CoreChartOptions,
  DatasetChartOptions,
  DoughnutControllerChartOptions,
  ElementChartOptions,
  LineControllerChartOptions,
  PluginChartOptions,
  ScaleChartOptions,
} from 'chart.js';

import { _DeepPartialObject } from 'chart.js/types/utils';
import { ChartProps } from '../Charts/ChartData';
import { TableProps } from '../Table/Table';
import { TextProps } from '../Text/TextStickerContent';

export interface StickerContent {
  none: null;
  pieChart: PieChartStickerType;
  lineChart: LineChartStickerType;
  barChart: BarChartStickerType;
  text: TextStickerType;
  table: TableStickerType;
}

export type StickerContentType = Extract<keyof StickerContent, string>;

interface PieChartStickerType {
  data: ChartData<'pie', number[], string>;
  options?:
    | _DeepPartialObject<
        CoreChartOptions<'pie'> &
          ElementChartOptions<'pie'> &
          PluginChartOptions<'pie'> &
          DatasetChartOptions<'pie'> &
          ScaleChartOptions<'pie'> &
          DoughnutControllerChartOptions
      >
    | undefined;
}

interface LineChartStickerType {
  data: ChartData<'line', number[], string>;
  options?:
    | _DeepPartialObject<
        CoreChartOptions<'line'> &
          ElementChartOptions<'line'> &
          PluginChartOptions<'line'> &
          DatasetChartOptions<'line'> &
          ScaleChartOptions<'line'> &
          LineControllerChartOptions
      >
    | undefined;
}

interface BarChartStickerType {
  data: ChartData<'bar', number[], string>;
  options?:
    | _DeepPartialObject<
        CoreChartOptions<'bar'> &
          ElementChartOptions<'bar'> &
          PluginChartOptions<'bar'> &
          DatasetChartOptions<'bar'> &
          ScaleChartOptions<'bar'> &
          BarControllerChartOptions
      >
    | undefined;
}

interface TableStickerType {
  something: string;
}

interface TextStickerType {
  content: string;
}

export type StickerContentPropType = ChartProps | TableProps | TextProps;

// [getNumOfPeopleByFilter(filters: [$filtersGrade, $filtersMan]), getNumOfPeopleByFilter(filters: [$filtersGrade, $filtersWoman]),  ]
// labels : 데이터 세트의 각 데이터에 매치되는 라벨의 배열
// datasets: 데이터 세트의 배열
// [ {
// 	label: 데이터 세트의 라벨
// 	data: 라벨 배열과 인덱스로 매칭되는 데이터 배열.
// }
// ]

// 라벨 하나당 일치하는 쿼리 + 필터 배열 => 데이터 하나 레시피

// dataset => [242, 24];
