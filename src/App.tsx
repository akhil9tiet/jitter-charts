import { useState } from 'react';
import './App.css';
import { AnimatedChartAnnotated } from './AnimatedChartAnnotated/AnimatedChartAnnotated';
import { AnimatedLineChart } from './AnimatedLineChart/AnimatedlineChart';
import { BarChart } from './BarChart/BarChart';
import { annotatedLineData, barChartData, storyArcData } from './demoData';

const charts = [
  { id: 'story', label: 'Story arc', title: 'Story arc line chart' },
  { id: 'annotated', label: 'Annotated line', title: 'Annotated line chart' },
  { id: 'bar', label: 'Bar chart', title: 'Two-series bar chart' },
] as const;

type ChartId = (typeof charts)[number]['id'];

const examples: Record<ChartId, { usage: string; data: string }> = {
  story: {
    usage: `import '@akhil9tiet/jitter-charts/style.css';
import { AnimatedLineChart, type StoryArcSeries } from '@akhil9tiet/jitter-charts';

const data: StoryArcSeries[] = [
  {
    name: 'Interstellar',
    color: '#2d3748',
    data: [
      { x: 1, value: -2, label: 'Dust storms' },
      { x: 2, value: -1, label: "Murph's ghost" },
      { x: 3, value: 2, label: 'Discovering NASA' },
    ],
  },
];

export function App() {
  return <AnimatedLineChart data={data} />;
}`,
    data: `type StoryArcSeries = {
  name: string;
  data: { x: number; value: number; label: string }[];
  color: string;
  strokeDasharray?: string;
};

const data: StoryArcSeries[] = [
  {
    name: 'Interstellar',
    color: '#2d3748',
    data: [
      { x: 1, value: -2, label: 'Dust storms' },
      { x: 2, value: -1, label: "Murph's ghost" },
    ],
  },
  {
    name: 'Baseline',
    color: '#a0aec0',
    strokeDasharray: '5,5',
    data: [
      { x: 1, value: 1, label: 'Opening image' },
      { x: 2, value: 2, label: 'Setup' },
    ],
  },
];`,
  },
  annotated: {
    usage: `import '@akhil9tiet/jitter-charts/style.css';
import { AnimatedChartAnnotated, type AnnotatedLinePoint } from '@akhil9tiet/jitter-charts';

const data: AnnotatedLinePoint[] = [
  { quarter: 'Q1', value: 24000 },
  { quarter: 'Q1_mid', value: 22000 },
  { quarter: 'Q2', value: 32000 },
  { quarter: 'Q2_mid', value: 43000 },
  { quarter: 'Q3', value: 48000 },
  { quarter: 'Q3_mid', value: 34000 },
  { quarter: 'Q4', value: 38000 },
];

export function App() {
  return <AnimatedChartAnnotated data={data} />;
}`,
    data: `type AnnotatedLinePoint = {
  quarter: string;
  value: number;
};

const data: AnnotatedLinePoint[] = [
  { quarter: 'Q1', value: 24000 },
  { quarter: 'Q1_mid', value: 22000 },
  { quarter: 'Q2', value: 32000 },
];`,
  },
  bar: {
    usage: `import '@akhil9tiet/jitter-charts/style.css';
import { BarChart, type BarChartPoint } from '@akhil9tiet/jitter-charts';

const data: BarChartPoint[] = [
  { day: 'Mon', dataset1: 25, dataset2: 50 },
  { day: 'Tue', dataset1: 15, dataset2: 60 },
  { day: 'Wed', dataset1: 45, dataset2: 85 },
];

export function App() {
  return <BarChart data={data} />;
}`,
    data: `type BarChartPoint = {
  day: string;
  dataset1: number;
  dataset2: number;
};

const data: BarChartPoint[] = [
  { day: 'Mon', dataset1: 25, dataset2: 50 },
  { day: 'Tue', dataset1: 15, dataset2: 60 },
  { day: 'Wed', dataset1: 45, dataset2: 85 },
];`,
  },
};

function App() {
  const [activeChart, setActiveChart] = useState<ChartId>('story');
  const selected = charts.find((chart) => chart.id === activeChart)!;
  const example = examples[activeChart];

  return (
    <main className="docs-page">
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Jitter Charts home">
          <span className="wordmark-icon" aria-hidden="true">J</span>
          <span>jitter charts</span>
        </a>
        <a className="header-link" href="https://www.npmjs.com/package/@akhil9tiet/jitter-charts" target="_blank" rel="noreferrer">
          npm package <span aria-hidden="true">↗</span>
        </a>
      </header>

      <section className="intro" id="top">
        <p className="eyebrow">REACT CHARTS, READY TO DROP IN</p>
        <h1>Motion that makes<br />the data <span>click.</span></h1>
        <p className="intro-copy">
          Three animated React charts. Pass your data in the included format and render.
        </p>
        <div className="install-command"><span aria-hidden="true">›</span> npm install @akhil9tiet/jitter-charts</div>
      </section>

      <section className="showcase" aria-labelledby="charts-heading">
        <div className="section-heading">
          <div>
            <p className="eyebrow">THE CHARTS</p>
            <h2 id="charts-heading">Pick a chart. See it move.</h2>
          </div>
          <span className="chart-count">03 COMPONENTS</span>
        </div>

        <nav className="chart-tabs" aria-label="Select a chart">
          {charts.map((chart, index) => (
            <button
              key={chart.id}
              type="button"
              className={`chart-tab${activeChart === chart.id ? ' is-active' : ''}`}
              aria-pressed={activeChart === chart.id}
              onClick={() => setActiveChart(chart.id)}
            >
              <span className="tab-index">0{index + 1}</span>{chart.label}
            </button>
          ))}
        </nav>

        <div className="preview-frame" key={activeChart}>
          <div className="preview-toolbar">
            <span className="preview-dot" />
            <span className="preview-dot" />
            <span className="preview-dot" />
            <span className="preview-label">LIVE PREVIEW</span>
          </div>
          <div className="preview-canvas">
            {activeChart === 'story' && <AnimatedLineChart data={storyArcData} />}
            {activeChart === 'annotated' && <AnimatedChartAnnotated data={annotatedLineData} />}
            {activeChart === 'bar' && <BarChart data={barChartData} />}
          </div>
          <div className="preview-caption">
            <span>{selected.title}</span>
            <span className="caption-status"><i /> Animates on mount</span>
          </div>
        </div>
      </section>

      <section className="code-section" aria-labelledby="usage-heading">
        <div className="section-heading code-heading">
          <div>
            <p className="eyebrow">COPY, PASTE, SHIP</p>
            <h2 id="usage-heading">Your data. This chart.</h2>
          </div>
          <span className="code-language">REACT + TYPESCRIPT</span>
        </div>
        <div className="code-grid">
          <CodePanel title="React usage" code={example.usage} />
          <CodePanel title="Data shape" code={example.data} />
        </div>
        <p className="data-note">Keep the field names and value types shown here. Add or remove rows as needed.</p>
      </section>

      <footer className="site-footer">
        <span>JITTER CHARTS</span>
        <span>Made for React. Animated with D3.</span>
      </footer>
    </main>
  );
}

function CodePanel({ title, code }: { title: string; code: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  return (
    <article className="code-panel">
      <div className="code-panel-header">
        <h3>{title}</h3>
        <button className="copy-button" type="button" onClick={copy}>{copied ? 'Copied' : 'Copy'}</button>
      </div>
      <pre><code>{code}</code></pre>
    </article>
  );
}

export default App;
