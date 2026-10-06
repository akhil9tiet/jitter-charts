# @akhil9tiet/jitter-charts

Animated React chart components with fixed visual styles and built-in motion.

## Live demo

[![Open the Jitter Charts live demo](https://raw.githubusercontent.com/akhil9tiet/jitter-charts/main/src/assets/linechart00.gif)](https://akhil9tiet.github.io/jitter-charts/)

[Open Jitter Charts](https://akhil9tiet.github.io/jitter-charts/) · [View the source on GitHub](https://github.com/akhil9tiet/jitter-charts)

## Purpose and third-party rights

This codebase aims to make it easier to use Jitter templates with real data and to build beautiful React charts with D3. It is an independent project and is not affiliated with or endorsed by Jitter.

I do not claim any rights over Jitter charts, templates, or the Jitter name. Those rights belong to their respective owners. I do not intend to infringe copyright, and I do not accept liability for third-party material that users add or use with this codebase. Users are responsible for checking permissions for that material. This notice does not override applicable law or determine legal liability.

## Chart previews

These previews show the three animated charts included in the package. Each chart animates when it renders in a React app.

### Animated line chart

![Animated line chart preview](https://raw.githubusercontent.com/akhil9tiet/jitter-charts/main/src/assets/linechart00.gif)

[View all charts in the live demo](https://akhil9tiet.github.io/jitter-charts/)

[Related Jitter template: Multiple Line Chart Green](https://jitter.video/template/multiple-line-chart-green/)

### Annotated line chart

![Annotated line chart preview](https://raw.githubusercontent.com/akhil9tiet/jitter-charts/main/src/assets/linechart01.gif)

[View all charts in the live demo](https://akhil9tiet.github.io/jitter-charts/)

[Related Jitter template: Animated Line Chart Blue](https://jitter.video/template/animated-line-chart-blue/)

### Bar chart

![Bar chart preview](https://raw.githubusercontent.com/akhil9tiet/jitter-charts/main/src/assets/barchart.gif)

[View all charts in the live demo](https://akhil9tiet.github.io/jitter-charts/)

[Related Jitter template: Stacked Bar Chart](https://jitter.video/template/stacked-bar-chart/)

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

## License

MIT. You can use, modify, and distribute this package for commercial or non-commercial purposes. Keep the copyright and license notice with copies. See [LICENSE](./LICENSE).
