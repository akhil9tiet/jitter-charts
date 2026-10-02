import { useState } from 'react';
import './App.css';
import { AnimatedLineChart } from './AnimatedLineChart/AnimatedlineChart';
import { AnimatedChartAnnotated } from './AnimatedChartAnnotated/AnimatedChartAnnotated';
import { BarChart } from './BarChart/BarChart';

const charts = [
  { id: 'story', label: 'Story Arc' },
  { id: 'annotated', label: 'Annotated Line' },
  { id: 'bar', label: 'Bar Chart' },
] as const;

type ChartId = (typeof charts)[number]['id'];

function App() {
  const [activeChart, setActiveChart] = useState<ChartId>('story');

  return (
    <main className="demo-page">
      <header className="demo-header">
        <p className="demo-eyebrow">CHART PLAYGROUND</p>
        <h1 className="demo-title">Choose a chart</h1>
        <nav className="chart-switcher" aria-label="Choose a chart">
          {charts.map((chart) => (
            <button
              key={chart.id}
              type="button"
              className={`chart-switcher-button${activeChart === chart.id ? ' is-active' : ''}`}
              aria-pressed={activeChart === chart.id}
              onClick={() => setActiveChart(chart.id)}
            >
              {chart.label}
            </button>
          ))}
        </nav>
      </header>

      <section className="chart-stage" aria-live="polite">
        {activeChart === 'story' && <AnimatedLineChart key="story" />}
        {activeChart === 'annotated' && <AnimatedChartAnnotated key="annotated" />}
        {activeChart === 'bar' && <BarChart key="bar" />}
      </section>
    </main>
  );
}

export default App;
