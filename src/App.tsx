import { useState, type ComponentType } from 'react';
import './App.css';
import { AnimatedLineChart } from './AnimatedLineChart/AnimatedlineChart';
import { AnimatedChartAnnotated } from './AnimatedChartAnnotated/AnimatedChartAnnotated';
import { BarChart } from './BarChart/BarChart';

type ChartId = 'story' | 'quarterly' | 'weekly';
type ChartFilter = 'all' | ChartId;

interface ChartPreview {
  id: ChartId;
  number: string;
  title: string;
  description: string;
  Component: ComponentType;
}

const chartPreviews: ChartPreview[] = [
  {
    id: 'story',
    number: '01',
    title: 'Story arc',
    description: 'Emotional beats across a feature-length story.',
    Component: AnimatedLineChart,
  },
  {
    id: 'quarterly',
    number: '02',
    title: 'Quarterly growth',
    description: 'A year of revenue, with the final quarter in focus.',
    Component: AnimatedChartAnnotated,
  },
  {
    id: 'weekly',
    number: '03',
    title: 'Weekly comparison',
    description: 'Two daily series compared across the week.',
    Component: BarChart,
  },
];

const filters: { id: ChartFilter; number: string; label: string }[] = [
  { id: 'all', number: '00', label: 'All charts' },
  { id: 'story', number: '01', label: 'Story arc' },
  { id: 'quarterly', number: '02', label: 'Quarterly growth' },
  { id: 'weekly', number: '03', label: 'Weekly comparison' },
];

function App() {
  const [selectedFilter, setSelectedFilter] = useState<ChartFilter>('all');
  const visibleCharts = chartPreviews.filter(
    (chart) => selectedFilter === 'all' || chart.id === selectedFilter,
  );

  return (
    <div className="app-shell">
      <aside className="library-sidebar" aria-label="Chart selection">
        <a className="brand-lockup" href="/" aria-label="Jitter Charts home">
          <span className="brand-mark" aria-hidden="true">J</span>
          <span>Jitter Charts</span>
        </a>

        <div className="sidebar-divider" />
        <p className="sidebar-label">Library</p>
        <fieldset className="filter-list">
          <legend className="visually-hidden">Choose charts to display</legend>
          {filters.map((filter) => (
            <label
              className={`chart-filter ${selectedFilter === filter.id ? 'is-selected' : ''}`}
              key={filter.id}
            >
              <input
                type="radio"
                name="chart-filter"
                value={filter.id}
                checked={selectedFilter === filter.id}
                onChange={() => setSelectedFilter(filter.id)}
              />
              <span className="filter-number">{filter.number}</span>
              <span className="filter-label">{filter.label}</span>
              <span className="filter-indicator" aria-hidden="true" />
            </label>
          ))}
        </fieldset>

        <div className="sidebar-footnote">
          <span className="status-dot" />
          <span>3 animated previews</span>
        </div>
      </aside>

      <main className="workspace">
        <header className="page-heading">
          <div>
            <p className="eyebrow">Data in motion</p>
            <h1>Chart previews</h1>
            <p className="page-description">
              Three animated studies, from story beats to weekly performance.
            </p>
          </div>
          <div className="result-count" aria-live="polite">
            <span className="result-count-value">{visibleCharts.length.toString().padStart(2, '0')}</span>
            <span>{visibleCharts.length === 1 ? 'preview' : 'previews'}</span>
          </div>
        </header>

        <section className="preview-grid" aria-label="Chart previews">
          {visibleCharts.map(({ id, number, title, description, Component }) => (
            <article className={`preview-card preview-card--${id}`} key={id}>
              <header className="preview-card-header">
                <div className="preview-card-title-row">
                  <span className="preview-number">{number}</span>
                  <h2>{title}</h2>
                </div>
                <p>{description}</p>
              </header>
              <div className="preview-visual">
                <Component />
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}

export default App;