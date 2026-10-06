import { useState } from 'react';
import './App.css';
import { AnimatedChartAnnotated } from './AnimatedChartAnnotated/AnimatedChartAnnotated';
import { AnimatedLineChart } from './AnimatedLineChart/AnimatedlineChart';
import { BarChart } from './BarChart/BarChart';
import { annotatedLineData, barChartData, storyArcData } from './demoData';

const charts = [
  { id: 'story', label: 'Story arc', tint: 'blue' },
  { id: 'annotated', label: 'Annotated line', tint: 'periwinkle' },
  { id: 'bar', label: 'Bar chart', tint: 'sand' },
] as const;

type ChartId = (typeof charts)[number]['id'];

function App() {
  const [activeChart, setActiveChart] = useState<ChartId>('story');
  const selected = charts.find((chart) => chart.id === activeChart)!;

  return (
    <main className={`paper-desk paper-desk--${selected.tint}`} id="top">
      <header className="site-header">
        <a className="wordmark" href="#top"><span className="wordmark-mark">J</span> JITTER CHARTS</a>
        <a className="package-link" href="https://www.npmjs.com/package/@akhil9tiet/jitter-charts" target="_blank" rel="noreferrer">NPM PACKAGE <span>↗</span></a>
      </header>

      <section className="library" aria-label="Animated chart library">
        <div className="paper-heading">
          <span className="section-kicker">THE CHART LIBRARY</span>
          <h1>Charts in motion</h1>
          <div className="heading-rule" aria-hidden="true"><i /><i /><i /></div>
        </div>

        <nav className="folder-tabs" aria-label="Choose a chart folder">
          {charts.map((chart, index) => (
            <button
              key={chart.id}
              type="button"
              className={`folder-tab folder-tab--${chart.tint}${activeChart === chart.id ? ' is-open' : ''}`}
              aria-pressed={activeChart === chart.id}
              onClick={() => setActiveChart(chart.id)}
            >
              <span className="tab-index">0{index + 1}</span>
              <span>{chart.label}</span>
              <span className="tab-mark" aria-hidden="true">↗</span>
            </button>
          ))}
        </nav>

        <section className={`chart-folder chart-folder--${selected.tint}`} aria-label={`${selected.label} chart preview`} key={activeChart}>
          <div className="folder-edge" aria-hidden="true"><span>JITTER / CHART FILES</span><span>0{charts.findIndex((chart) => chart.id === activeChart) + 1} — 03</span></div>
          <div className={`chart-mat chart-mat--${activeChart}`}>
            {activeChart === 'story' && <AnimatedLineChart data={storyArcData} />}
            {activeChart === 'annotated' && <AnimatedChartAnnotated data={annotatedLineData} />}
            {activeChart === 'bar' && <BarChart data={barChartData} />}
          </div>
          <div className="folder-caption"><span>SELECTED FOLDER</span><strong>{selected.label}</strong><span className="motion-status"><i /> PLAYING</span></div>
        </section>
      </section>

      <footer className="page-footer"><span>JITTER CHARTS © 2026</span><span>THREE LITTLE FILES, A LOT OF FEELING</span><span>MADE FOR REACT</span></footer>
    </main>
  );
}

export default App;
