import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './AnimatedLineChart/AnimatedLineChart.css'
import './AnimatedChartAnnotated/AnimatedChartAnnotated.css'
import './BarChart/BarChart.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
