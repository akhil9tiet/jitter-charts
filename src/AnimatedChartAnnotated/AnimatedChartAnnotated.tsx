import { useEffect, useRef, useState } from 'react';
import type { FC } from 'react';
import * as d3 from 'd3';
import type { AnnotatedLinePoint } from '../types';

export interface AnimatedChartAnnotatedProps {
  data: AnnotatedLinePoint[];
}

export const AnimatedChartAnnotated: FC<AnimatedChartAnnotatedProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const lastPoint = data[data.length - 1];
  const previousPoint = data[data.length - 2];
  const trend = lastPoint && previousPoint?.value
    ? ((lastPoint.value - previousPoint.value) / previousPoint.value) * 100
    : 0;

  const [animationStarted, setAnimationStarted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimationStarted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const svgElement = svgRef.current;
    if (!svgElement || !animationStarted || data.length === 0) return;
    if (!lastPoint) return;

    const margin = { top: 40, right: 60, bottom: 50, left: 60 };
    const width = 500;
    const height = 260;
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    d3.select(svgElement).selectAll('*').remove();

    const svg = d3
      .select(svgElement)
      .attr('width', width)
      .attr('height', height)
      .style('opacity', 1);

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const xScale = d3
      .scalePoint()
      .domain(data.map((d) => d.quarter))
      .range([0, chartWidth]);

    const maxValue = Math.max(1, d3.max(data, (d) => d.value) ?? 1);
    const yScale = d3.scaleLinear().domain([0, maxValue * 1.25]).range([chartHeight, 0]);

    const yTicks = yScale.ticks(4);
    g.append('g')
      .attr('class', 'grid')
      .selectAll('line')
      .data(yTicks)
      .enter()
      .append('line')
      .attr('x1', 0)
      .attr('x2', chartWidth)
      .attr('y1', (d) => yScale(d))
      .attr('y2', (d) => yScale(d))
      .attr('stroke', '#c7e2ec')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '2,4');

    g.append('g')
      .selectAll('text')
      .data(yTicks)
      .enter()
      .append('text')
      .attr('x', -15)
      .attr('y', (d) => yScale(d) + 4)
      .attr('text-anchor', 'end')
      .attr('fill', '#718e9c')
      .style('font-size', '11px')
      .style('font-weight', '500')
      .text((d) => (d >= 1000 ? `${d / 1000}K` : `${d}`));

    const mainQuarters = data.map((d) => d.quarter).filter((quarter) => !quarter.endsWith('_mid'));
    g.append('g')
      .selectAll('text')
      .data(mainQuarters)
      .enter()
      .append('text')
      .attr('x', (d) => xScale(d) || 0)
      .attr('y', chartHeight + 30)
      .attr('text-anchor', 'middle')
      .attr('fill', (d) => (d === lastPoint.quarter ? '#111827' : '#718e9c'))
      .style('font-size', '12px')
      .style('font-weight', (d) => (d === lastPoint.quarter ? '700' : '500'))
      .text((d) => d);

    const lineGenerator = d3
      .line<AnnotatedLinePoint>()
      .x((d) => xScale(d.quarter) || 0)
      .y((d) => yScale(d.value))
      .curve(d3.curveCatmullRom.alpha(0.5));

    const path = g
      .append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#16222f')
      .attr('stroke-width', 2.5)
      .attr('stroke-linecap', 'round')
      .attr('d', lineGenerator);

    const totalLength = path.node()?.getTotalLength() || 0;
    const animationDuration = 2000;

    path
      .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
      .attr('stroke-dashoffset', totalLength)
      .transition()
      .duration(animationDuration)
      .ease(d3.easeCubicOut)
      .attr('stroke-dashoffset', 0);

    if (counterRef.current) {
      d3.select(counterRef.current)
        .transition()
        .duration(animationDuration - 200)
        .tween('text', function () {
          const interpolator = d3.interpolateNumber(0, lastPoint.value);
          return function (t) {
            const currentVal = Math.floor(interpolator(t));
            counterRef.current!.innerText = currentVal.toLocaleString();
          };
        });
    }

    const targetX = xScale(lastPoint.quarter) || 0;
    const targetY = yScale(lastPoint.value);

    const annotationLine = g
      .append('line')
      .attr('x1', targetX)
      .attr('x2', targetX)
      .attr('y1', chartHeight)
      .attr('y2', chartHeight)
      .attr('stroke', '#16222f')
      .attr('stroke-dasharray', '3,3')
      .attr('stroke-width', 1.5)
      .style('opacity', 0);

    annotationLine
      .transition()
      .delay(animationDuration - 400)
      .duration(600)
      .attr('y2', targetY)
      .style('opacity', 0.6);

    const pulseCircle = g
      .append('circle')
      .attr('cx', targetX)
      .attr('cy', targetY)
      .attr('r', 0)
      .attr('fill', 'none')
      .attr('stroke', '#16222f')
      .attr('stroke-width', 1.5)
      .style('opacity', 0);

    pulseCircle
      .transition()
      .delay(animationDuration - 100)
      .duration(800)
      .attr('r', 7)
      .style('opacity', 0.4)
      .transition()
      .duration(800)
      .attr('r', 5)
      .style('opacity', 0.8)
      .on('end', function repeat() {
        d3.select(this)
          .transition()
          .duration(1000)
          .attr('r', 8)
          .style('opacity', 0)
          .transition()
          .duration(0)
          .attr('r', 0)
          .style('opacity', 0.8)
          .on('end', repeat);
      });

    g.append('circle')
      .attr('cx', targetX)
      .attr('cy', targetY)
      .attr('r', 0)
      .attr('fill', '#16222f')
      .transition()
      .delay(animationDuration - 100)
      .duration(400)
      .attr('r', 3);
    return () => {
      d3.select(svgElement).selectAll('*').interrupt();
    };
  }, [animationStarted, data, lastPoint]);

  return (
    <div className="jc-annotated-wrapper">
      <div ref={containerRef} className={`dashboard-card ${animationStarted ? 'state-enter' : ''}`}>
        {/* Adjusted Header Structure */}
        <div className="card-header">
          <div className="header-meta">
            <span className="dataset-label">{data[data.length - 1]?.quarter ?? 'LATEST'} DATASET</span>
            <h1 ref={counterRef} className="counter-value">
              0
            </h1>
          </div>
          <div className="trend-badge-wrapper">
            <div className="trend-badge">
              <span className="trend-icon">~</span>
              <span>{`${trend > 0 ? '+' : ''}${trend.toFixed(0)}%`}</span>
            </div>
          </div>
        </div>

        <div className="chart-wrapper">
          <svg ref={svgRef}></svg>
        </div>
      </div>
    </div>
  );
};
