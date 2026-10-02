import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import './BarChart.css';

interface DataPoint {
  day: string;
  dataset1: number;
  dataset2: number;
}

const chartData: DataPoint[] = [
  { day: 'Mon', dataset1: 25, dataset2: 50 },
  { day: 'Tue', dataset1: 15, dataset2: 60 },
  { day: 'Wed', dataset1: 45, dataset2: 85 },
  { day: 'Thu', dataset1: 20, dataset2: 55 },
  { day: 'Fri', dataset1: 22, dataset2: 58 },
  { day: 'Sat', dataset1: 10, dataset2: 65 },
  { day: 'Sun', dataset1: 5,  dataset2: 30 },
];

export const BarChart: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [stat1, setStat1] = useState<string>('0.00');
  const [stat2, setStat2] = useState<string>('0.00');

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
      .attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Scales
    const xScale = d3.scaleBand()
      .domain(chartData.map(d => d.day))
      .range([0, width])
      .padding(0.45);

    const yScale = d3.scaleLinear()
      .domain([0, 100])
      .range([height, 0]);

    // Dashed Grid Lines
    const gridTicks = [25, 50, 75, 100];
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
      .data(chartData)
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
      .delay((_, i) => 150 + i * 80)
      .duration(800)
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
      .delay((_, i) => 150 + i * 80)
      .duration(800)
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
    const animateOdometer = (target: number, setter: React.Dispatch<React.SetStateAction<string>>) => {
      d3.transition()
        .duration(1000)
        .ease(d3.easeQuadOut)
        .tween('text', () => {
          const interpolator = d3.interpolateNumber(0, target);
          return (t) => setter(interpolator(t).toFixed(2));
        });
    };

    animateOdometer(1.91, setStat1);
    animateOdometer(1.85, setStat2);

  }, []);

  return (
    <div className="bar-chart">
      <div className="bar-chart-header">
        <span className="bar-chart-subtitle">Last 7 days</span>
      </div>

      <div className="bar-chart-stats">
        <div className="bar-chart-stat">
          <div className="bar-chart-stat-number">{stat1}</div>
          <div className="bar-chart-stat-label">
            <span className="bar-chart-dot primary"></span> Dataset 1, daily avg.
          </div>
        </div>
        <div className="bar-chart-stat">
          <div className="bar-chart-stat-number">{stat2}</div>
          <div className="bar-chart-stat-label">
            <span className="bar-chart-dot secondary"></span> Dataset 2, daily avg.
          </div>
        </div>
      </div>

      <div className="bar-chart-plot">
        <svg ref={svgRef} />
      </div>

      <div className="bar-chart-legend">
        <div className="bar-chart-legend-item"><span className="bar-chart-dot primary"></span> Dataset 1</div>
        <div className="bar-chart-legend-item"><span className="bar-chart-dot secondary-bg"></span> Dataset 2</div>
      </div>
    </div>
  );
};