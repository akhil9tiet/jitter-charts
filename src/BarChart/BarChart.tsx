import { useEffect, useRef } from 'react';
import type { FC } from 'react';
import * as d3 from 'd3';
import type { BarChartPoint } from '../types';

export interface BarChartProps {
  data: BarChartPoint[];
}

const barEntryDelay = 150;
const barStagger = 80;
const barDuration = 800;

export const BarChart: FC<BarChartProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const stat1Ref = useRef<HTMLDivElement | null>(null);
  const stat2Ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const margin = { top: 10, right: 0, bottom: 20, left: 0 };
    const width = 476; // Inner width mapping to the container dimensions
    const height = 180 - margin.top - margin.bottom;

    // Clear previous SVG contents for clean rendering
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const chartGroup = svg
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Scales
    const xScale = d3.scaleBand()
      .domain(data.map(d => d.day))
      .range([0, width])
      .padding(0.45);

    const maxValue = Math.max(1, d3.max(data, (point) => Math.max(point.dataset1, point.dataset2)) ?? 1);
    const yScale = d3.scaleLinear()
      .domain([0, maxValue * 1.15])
      .range([height, 0]);

    // Dashed Grid Lines
    const gridTicks = yScale.ticks(4);
    chartGroup.selectAll('.y-grid-line')
      .data(gridTicks)
      .enter()
      .append('line')
      .attr('class', 'y-grid-line')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', d => yScale(d))
      .attr('y2', d => yScale(d));

    // Axis baseline
    chartGroup.append('line')
      .attr('class', 'axis-baseline')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', height)
      .attr('y2', height);

    // Render Data Columns
    const barGroups = chartGroup.selectAll('.bar-group')
      .data(data)
      .enter()
      .append('g')
      .attr('transform', d => `translate(${xScale(d.day)}, 0)`);

    // --- Entry Animation Sequence ---

    // 1. Dataset 2: Secondary Background Bars (Light Purple)
    barGroups.append('rect')
      .attr('class', 'd3-bar-secondary')
      .attr('x', 0)
      .attr('width', xScale.bandwidth())
      .attr('y', height)
      .attr('height', 0)
      .attr('rx', 8)
      .transition()
      .delay((_, i) => barEntryDelay + i * barStagger)
      .duration(barDuration)
      .ease(d3.easeCubicOut)
      .attr('y', d => yScale(d.dataset2))
      .attr('height', d => height - yScale(d.dataset2));

    // 2. Dataset 1: Primary Foreground Bars (Deep Purple)
    barGroups.append('rect')
      .attr('class', 'd3-bar-primary')
      .attr('x', 0)
      .attr('width', xScale.bandwidth())
      .attr('y', height)
      .attr('height', 0)
      .attr('rx', 8)
      .transition()
      .delay((_, i) => barEntryDelay + i * barStagger)
      .duration(barDuration)
      .ease(d3.easeCubicOut)
      .attr('y', d => yScale(d.dataset1))
      .attr('height', d => height - yScale(d.dataset1));

    // X-Axis Labels
    barGroups.append('text')
      .attr('class', 'd3-x-label')
      .attr('x', xScale.bandwidth() / 2)
      .attr('y', height + 18)
      .attr('text-anchor', 'middle')
      .text(d => d.day);

    // Odometer Counter Effect
    const animateOdometer = (element: HTMLDivElement | null, target: number) => {
      if (!element) return;
      d3.transition()
        .duration(1000)
        .ease(d3.easeQuadOut)
        .tween('text', () => {
          const interpolator = d3.interpolateNumber(0, target);
          return (t) => {
            element.textContent = interpolator(t).toFixed(2);
          };
        });
    };

    const mean1 = data.length ? d3.mean(data, (point) => point.dataset1) ?? 0 : 0;
    const mean2 = data.length ? d3.mean(data, (point) => point.dataset2) ?? 0 : 0;
    animateOdometer(stat1Ref.current, mean1);
    animateOdometer(stat2Ref.current, mean2);

    return () => {
      svg.interrupt();
      svg.selectAll('*').interrupt();
    };
  }, [data]);

  return (
    <div className="jitter-bar-card">
      <div className="header">
        <span className="title">Bar Chart</span>
        <span className="subtitle">{data.length ? `Last ${data.length} days` : 'No data'}</span>
      </div>

      <div className="stats-grid">
        <div className="stat-box">
          <div className="stat-number" ref={stat1Ref}>0.00</div>
          <div className="stat-label">
            <span className="dot primary"></span> Dataset 1, Daily avg.
          </div>
        </div>
        <div className="stat-box">
          <div className="stat-number" ref={stat2Ref}>0.00</div>
          <div className="stat-label">
            <span className="dot secondary"></span> Dataset 2, Daily avg.
          </div>
        </div>
      </div>

      <div className="chart-container">
        <svg ref={svgRef}></svg>
      </div>

      <div className="legend-footer">
        <div className="legend-item"><span className="dot primary"></span> Dataset 1</div>
        <div className="legend-item"><span className="dot secondary-bg"></span> Dataset 2</div>
      </div>
    </div>
  );
};
