import { useEffect, useRef, useState } from 'react';
import type { FC } from 'react';
import * as d3 from 'd3';
import type { StoryArcPoint, StoryArcSeries } from '../types';

export interface AnimatedLineChartProps {
  data: StoryArcSeries[];
}

export const AnimatedLineChart: FC<AnimatedLineChartProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [animationStarted, setAnimationStarted] = useState(false);

  // -----------------------------
  // ANIMATION TRIGGER
  // -----------------------------
  useEffect(() => {
    const timer = setTimeout(() => setAnimationStarted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // -----------------------------
  // D3 RENDER
  // -----------------------------
  useEffect(() => {
    const svgElement = svgRef.current;
    if (!svgElement || !animationStarted || data.length === 0) return;

    const margin = { top: 60, right: 40, bottom: 80, left: 50 };
    const width = 460;
    const height = 340;
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    d3.select(svgElement).selectAll('*').remove();

    const svg = d3
      .select(svgElement)
      .attr('width', width)
      .attr('height', height);

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // -----------------------------
    // AXES
    // -----------------------------
    const points = data.flatMap((series) => series.data);
    if (points.length === 0) return;
    const xExtent = d3.extent(points, (point) => point.x);
    const yExtent = d3.extent(points, (point) => point.value);
    const xScale = d3.scaleLinear().domain(xExtent as [number, number]).range([0, chartWidth]);
    const yScale = d3.scaleLinear()
      .domain([Math.min(0, (yExtent[0] ?? -1) - 2), Math.max(0, (yExtent[1] ?? 1) + 2)])
      .range([chartHeight, 0]);

    const xAxis = d3.axisBottom(xScale).ticks(12).tickFormat(d3.format('d'));
    const yAxis = d3.axisLeft(yScale).ticks(10);

    g.append('g')
      .attr('transform', `translate(0,${chartHeight})`)
      .call(xAxis)
      .call((g) => g.select('.domain').remove());

    g.append('g')
      .call(yAxis)
      .call((g) => g.selectAll('.domain').remove())
      .call((g) => g.selectAll('line').remove());

    // -----------------------------
    // GRID LINES
    // -----------------------------
    g.append('g')
      .attr('class', 'grid-lines')
      .selectAll('line')
      .data(yScale.ticks(10))
      .enter()
      .append('line')
      .attr('x1', 0)
      .attr('x2', chartWidth)
      .attr('y1', (d) => yScale(d))
      .attr('y2', (d) => yScale(d))
      .attr('stroke', '#d6dcc0')
      .attr('stroke-width', 1);

    // -----------------------------
    // LINE GENERATOR
    // -----------------------------
    const lineGenerator = d3
      .line<StoryArcPoint>()
      .x((d) => xScale(d.x))
      .y((d) => yScale(d.value))
      .curve(d3.curveCatmullRom.alpha(0.5));

    // -----------------------------
    // DRAW LINES (NO DOTS)
    // -----------------------------
    // DRAW LINES
    data.forEach((lineData) => {
      const path = g
        .append('path')
        .datum(lineData.data)
        .attr('d', lineGenerator)
        .attr('fill', 'none')
        .attr('stroke', lineData.color)
        .attr('stroke-width', 2.5);

      // ðŸ”¥ THIS IS THE IMPORTANT PART
      if (lineData.strokeDasharray) {
        path.attr('stroke-dasharray', lineData.strokeDasharray);
      } else {
        path.attr('stroke-dasharray', 'none'); // ensure solid line stays solid
      }

      const totalLength = path.node()?.getTotalLength() || 0;

      path
        .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
        .attr('stroke-dashoffset', totalLength)
        .transition()
        .duration(1400)
        .ease(d3.easeCubicOut)
        .attr('stroke-dashoffset', 0)
        .on('end', function () {
          // restore final style
          if (lineData.strokeDasharray) {
            d3.select(this).attr('stroke-dasharray', lineData.strokeDasharray);
          } else {
            d3.select(this).attr('stroke-dasharray', 'none');
          }
        });
    });
    return () => {
      d3.select(svgElement).selectAll('*').interrupt();
    };
  }, [animationStarted, data]);

  // -----------------------------
  // JSX
  // -----------------------------
  return (
    <div
      className={`story-arc-container ${animationStarted ? 'animate' : ''}`}
    >
      <div className={`story-arc-canvas ${animationStarted ? 'animate' : ''}`}>
        <h2 className={`chart-title ${animationStarted ? 'animate' : ''}`}>
          Story Arc Chart
        </h2>

        <svg ref={svgRef}></svg>

        <div className={`legend ${animationStarted ? 'animate' : ''}`}>
          {data.map((series) => (
            <div className="legend-item" key={series.name}>
              <svg width="30" height="2" aria-hidden="true">
                <line
                  x1="0"
                  y1="1"
                  x2="30"
                  y2="1"
                  stroke={series.color}
                  strokeWidth="2"
                  strokeDasharray={series.strokeDasharray}
                />
              </svg>
              <span>{series.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
