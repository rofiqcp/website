import React from 'react';

const ToggleButton = ({ id, label, value, onChange }) => {
  const handleClick = () => {
    onChange(id, !value);
  };

  return (
    <div className="toggle-button">
      <div 
        className={`toggle-switch ${value ? 'active' : ''}`}
        onClick={handleClick}
      ></div>
      <span className="control-label">{label}</span>
      <span className="status-text">{value ? 'ON' : 'OFF'}</span>
    </div>
  );
};

export default ToggleButton;
