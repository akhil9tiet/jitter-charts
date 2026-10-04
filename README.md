# @akhil9tiet/jitter-charts

Animated React chart components with fixed visual styles and built-in motion.

## Install

```sh
npm install @akhil9tiet/jitter-charts
```

Import the chart stylesheet once in your app entry:

```ts
import '@akhil9tiet/jitter-charts/style.css';
```

React and React DOM are peer dependencies. The charts use D3 internally.

## Use a chart

Each chart takes one required `data` prop. The exported TypeScript types describe the accepted data shapes.

```tsx
import '@akhil9tiet/jitter-charts/style.css';
import { BarChart, type BarChartPoint } from '@akhil9tiet/jitter-charts';

const data: BarChartPoint[] = [
  { day: 'Mon', dataset1: 25, dataset2: 50 },
  { day: 'Tue', dataset1: 15, dataset2: 60 },
];

export function App() {
  return <BarChart data={data} />;
}
```

## Components and data

### `AnimatedLineChart`

```ts
type StoryArcSeries = {
  name: string;
  data: { x: number; value: number; label: string }[];
  color: string;
  strokeDasharray?: string;
};
```

Pass an array of series. Each point needs numeric `x` and `value`, and a `label` string.

### `AnimatedChartAnnotated`

```ts
type AnnotatedLinePoint = {
  quarter: string;
  value: number;
};
```

Pass an array of points in display order. Quarter names ending in `_mid` are shown on the line and omitted from the main x-axis labels.

### `BarChart`

```ts
type BarChartPoint = {
  day: string;
  dataset1: number;
  dataset2: number;
};
```

Pass an array of categories and two numeric series. The summary values are calculated from the rows.

## Build

```sh
npm run dev
npm run build
npm run build:package
```

`npm run build:package` writes the publishable ESM, CommonJS, stylesheet, and declaration files to `dist-package/`.
