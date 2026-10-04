export interface StoryArcPoint {
  x: number;
  value: number;
  label: string;
}

export interface StoryArcSeries {
  name: string;
  data: StoryArcPoint[];
  color: string;
  strokeDasharray?: string;
}

export interface AnnotatedLinePoint {
  quarter: string;
  value: number;
}

export interface BarChartPoint {
  day: string;
  dataset1: number;
  dataset2: number;
}
