import React from 'react';

const VariableDisplay = ({ id, label, value, unit, type = 'decimal' }) => {
  const formatValue = (val) => {
    if (type === 'integer') {
      return Math.floor(val).toString();
    } else {
      return typeof val === 'number' ? val.toFixed(2) : '0.00';
    }
  };

  const getDescription = (id) => {
    switch (id) {
      case 0:
        return 'Counter Value';
      case 1:
        return 'Temperature';
      default:
        return 'Sensor Reading';
    }
  };

  const getIcon = (id) => {
    switch (id) {
      case 0:
        return '🔢';
      case 1:
        return '🌡️';
      default:
        return '📊';
    }
  };

  return (
    <div className="variable-display">
      <div className="variable-info">
        <div className="variable-label">
          {getIcon(id)} {label}
        </div>
        <div className="variable-description">
          {getDescription(id)}
        </div>
      </div>
      <div className="variable-value-container">
        <div className="variable-value">
          {formatValue(value)}
        </div>
        <div className="variable-unit">
          {unit}
        </div>
      </div>
    </div>
  );
};

export default VariableDisplay;
