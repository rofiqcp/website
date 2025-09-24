import { render, screen } from '@testing-library/react';
import App from './App';

test('renders SCADA ESP32 Control header', () => {
  render(<App />);
  const headerElement = screen.getByText(/SCADA ESP32 Control/i);
  expect(headerElement).toBeInTheDocument();
});

test('renders control panels', () => {
  render(<App />);
  const toggleControls = screen.getByText(/Toggle Controls/i);
  const pushButtons = screen.getByText(/Push Buttons/i);
  const sliderControls = screen.getByText(/Slider Controls/i);
  
  expect(toggleControls).toBeInTheDocument();
  expect(pushButtons).toBeInTheDocument();
  expect(sliderControls).toBeInTheDocument();
});

test('renders display panels', () => {
  render(<App />);
  const statusLampu = screen.getByText(/Status Lampu/i);
  const gaugeMonitoring = screen.getByText(/Gauge Monitoring/i);
  const variableMonitor = screen.getByText(/Variable Monitor/i);
  
  expect(statusLampu).toBeInTheDocument();
  expect(gaugeMonitoring).toBeInTheDocument();
  expect(variableMonitor).toBeInTheDocument();
});
