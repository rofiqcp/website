import React from 'react';

const GaugeDisplay = ({ id, label, value, unit, min = 0, max = 100 }) => {
  const percentage = Math.min(Math.max((value - min) / (max - min) * 100, 0), 100);
  const rotation = (percentage / 100) * 270 - 135; // 270 degrees range, starting from -135deg
  
  const getColor = (percentage) => {
    if (percentage < 30) return '#4CAF50'; // Green
    if (percentage < 70) return '#FF9800'; // Orange
    return '#f44336'; // Red
  };

  const displayValue = typeof value === 'number' ? value.toFixed(1) : '0.0';

  return (
    <div className="gauge-display">
      <div className="gauge-circle" style={{
        background: `conic-gradient(from -135deg, ${getColor(percentage)} 0deg, ${getColor(percentage)} ${percentage * 2.7}deg, #e0e0e0 ${percentage * 2.7}deg)`
      }}>
        <div className="gauge-inner">
          <div className="gauge-value">{displayValue}</div>
          <div className="gauge-unit">{unit}</div>
        </div>
        <div 
          className="gauge-needle" 
          style={{ 
            transform: `rotate(${rotation}deg)`,
            position: 'absolute',
            width: '2px',
            height: '40px',
            background: '#333',
            transformOrigin: 'bottom center',
            top: '20px'
          }}
        ></div>
      </div>
      <span className="gauge-label">{label}</span>
      <div className="gauge-range">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
};

export default GaugeDisplay;
