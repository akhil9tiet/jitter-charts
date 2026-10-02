import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import './AnimatedLineChart.css';

interface StoryPoint {
  x: number;
  value: number;
  label: string;
}

interface LineData {
  name: string;
  data: StoryPoint[];
  color: string;
  strokeDasharray?: string;
}

const baseline: StoryPoint[] = [
    { x: 1, value: 1, label: 'Opening image' },
    { x: 2, value: 2, label: 'Setup' },
    { x: 3, value: 1, label: 'Theme stated' },
    { x: 4, value: -3, label: 'Inciting incident' },
    { x: 5, value: -5, label: 'Debate' },
    { x: 6, value: 0, label: 'Break into Act II' },
    { x: 7, value: 2, label: 'B story' },
    { x: 8, value: -2, label: 'Fun and games begins' },
    { x: 9, value: -4, label: 'Rising complications' },
    { x: 10, value: -6, label: 'Mid-crisis setup' },
    { x: 11, value: -3, label: 'Hope spot' },
    { x: 12, value: 0, label: 'Midpoint (reversal)' },
    { x: 13, value: 1, label: 'Escalation' },
    { x: 14, value: -1, label: 'Tension mounts' },
    { x: 15, value: -3, label: 'Bad guys close in' },
    { x: 16, value: -8, label: 'All is lost' },
    { x: 17, value: -6, label: 'Dark night of the soul' },
    { x: 18, value: -2, label: 'Break into Act III' },
    { x: 19, value: 3, label: 'Final approach' },
    { x: 20, value: 6, label: 'Climax' },
    { x: 21, value: 8, label: 'Payoff' },
    { x: 22, value: 6, label: 'Falling action' },
    { x: 23, value: 4, label: 'Denouement' },
    { x: 24, value: 7, label: 'Final image' },
];

const interstellar: StoryPoint[] = [
    { x: 1, value: -2, label: 'Earth dying / Dust storms' },
    { x: 2, value: -1, label: "Murph's ghost" },
    { x: 3, value: 2, label: 'Discovering NASA' },
    { x: 4, value: 0, label: 'The mission choice' },
    { x: 5, value: -5, label: 'Leaving Murph behind' },
    { x: 6, value: 4, label: 'Launch' },
    { x: 7, value: 3, label: 'Wormhole travel' },
    { x: 8, value: 0, label: "Miller's Planet" },
    { x: 9, value: -6, label: '23 years lost' },
    { x: 10, value: -4, label: 'Messages from home' },
    { x: 11, value: -1, label: "Mann's Planet debate" },
    { x: 12, value: -7, label: "Dr. Mann's betrayal" },
    { x: 13, value: -5, label: 'Docking sequence' },
    { x: 14, value: -3, label: 'Slingshot maneuver' },
    { x: 15, value: -8, label: 'Cooper detaches' },
    { x: 16, value: 5, label: 'Inside the Tesseract' },
    { x: 17, value: 7, label: 'Communicating with Murph' },
    { x: 18, value: 6, label: 'Murph solves gravity' },
    { x: 19, value: 3, label: 'Tesseract closes' },
    { x: 20, value: 4, label: 'Cooper Station rescue' },
    { x: 21, value: 5, label: 'Reuniting with Murph' },
    { x: 22, value: 2, label: 'Bittersweet goodbye' },
    { x: 23, value: 6, label: 'Stealing the ship' },
    { x: 24, value: 7, label: 'Finding Brand' },
];

const lines: LineData[] = [
  { name: 'Interstellar', data: interstellar, color: '#2d3748' },
  {
    name: 'Baseline',
    data: baseline,
    color: '#a0aec0',
    strokeDasharray: '5,5',
  },
];

export const AnimatedLineChart: React.FC = () => {
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
    if (!svgRef.current || !animationStarted) return;

    const margin = { top: 60, right: 40, bottom: 80, left: 50 };
    const width = 460;
    const height = 340;
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // -----------------------------
    // AXES
    // -----------------------------
    const xScale = d3.scaleLinear().domain([1, 24]).range([0, chartWidth]);
    const yScale = d3.scaleLinear().domain([-10, 10]).range([chartHeight, 0]);

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
      .line<StoryPoint>()
      .x((d) => xScale(d.x))
      .y((d) => yScale(d.value))
      .curve(d3.curveCatmullRom.alpha(0.5));

    // -----------------------------
    // DRAW LINES (NO DOTS)
    // -----------------------------
    // DRAW LINES
    lines.forEach((lineData) => {
      const path = g
        .append('path')
        .datum(lineData.data)
        .attr('d', lineGenerator)
        .attr('fill', 'none')
        .attr('stroke', lineData.color)
        .attr('stroke-width', 2.5);

      // 🔥 THIS IS THE IMPORTANT PART
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
  }, [animationStarted]);

  // -----------------------------
  // JSX
  // -----------------------------
  return (
    <div
      className={`chart-container ${animationStarted ? 'animate' : ''}`}
    >
      <div className={`chart-canvas ${animationStarted ? 'animate' : ''}`}>
        <h2 className={`chart-title ${animationStarted ? 'animate' : ''}`}>
          Story Arc Chart
        </h2>

        <svg ref={svgRef}></svg>

        <div className={`legend ${animationStarted ? 'animate' : ''}`}>
          <div className="legend-item">
            <svg width="30" height="2">
              <line
                x1="0"
                y1="1"
                x2="30"
                y2="1"
                stroke="#2d3748"
                strokeWidth="2"
              />
            </svg>
            <span>Interstellar</span>
          </div>

          <div className="legend-item">
            <svg width="30" height="2">
              <line
                x1="0"
                y1="1"
                x2="30"
                y2="1"
                stroke="#a0aec0"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
            </svg>
            <span>Baseline</span>
          </div>
        </div>
      </div>
    </div>
  );
};
