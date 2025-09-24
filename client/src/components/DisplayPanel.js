import React from 'react';
import LampIndicator from './displays/LampIndicator';
import GaugeDisplay from './displays/GaugeDisplay';
import VariableDisplay from './displays/VariableDisplay';
import './DisplayPanel.css';

const DisplayPanel = ({ deviceState }) => {
  return (
    <div className="grid grid-3">
      {/* Lamp Indicators */}
      <div className="card">
        <h3 className="section-title">💡 Status Lampu</h3>
        <div className="display-grid">
          {deviceState.lamps.map((status, index) => (
            <LampIndicator
              key={index}
              id={index}
              label={`Lampu ${index + 1}`}
              status={status}
            />
          ))}
        </div>
      </div>

      {/* Gauge Displays */}
      <div className="card">
        <h3 className="section-title">📊 Gauge Monitoring</h3>
        <div className="gauge-container">
          {deviceState.gauges.map((value, index) => (
            <GaugeDisplay
              key={index}
              id={index}
              label={`Gauge ${index + 1}`}
              value={value}
              unit={index === 0 ? '%' : 'RPM'}
              min={0}
              max={index === 0 ? 100 : 1000}
            />
          ))}
        </div>
      </div>

      {/* Variable Displays */}
      <div className="card">
        <h3 className="section-title">📈 Variable Monitor</h3>
        <div className="variable-container">
          {deviceState.variables.map((value, index) => (
            <VariableDisplay
              key={index}
              id={index}
              label={`Variable ${index + 1}`}
              value={value}
              unit={index === 0 ? 'Units' : '°C'}
              type={index === 0 ? 'integer' : 'decimal'}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DisplayPanel;
