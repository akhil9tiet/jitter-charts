import { useState } from 'react';
import './App.css';
import { AnimatedLineChart } from './AnimatedLineChart/AnimatedlineChart';
import { AnimatedChartAnnotated } from './AnimatedChartAnnotated/AnimatedChartAnnotated';

import { BarChart } from './BarChart/BarChart';

function App() {
  return (
    <>
      <section id="center">
        <AnimatedLineChart />

        <AnimatedChartAnnotated />
        <BarChart />
        {/* <NeonLineChart data={sampleData} scaleType="symlog" />; */}
      </section>
    </>
  );
}

export default App;
