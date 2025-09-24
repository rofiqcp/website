import React from 'react';

const LampIndicator = ({ id, label, status }) => {
  return (
    <div className="lamp-indicator">
      <div className={`lamp-bulb ${status ? 'on' : 'off'}`}>
        💡
      </div>
      <span className="control-label">{label}</span>
      <span className="status-text">{status ? 'ON' : 'OFF'}</span>
    </div>
  );
};

export default LampIndicator;
