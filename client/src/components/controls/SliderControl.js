import React from 'react';

const SliderControl = ({ id, label, value, onChange }) => {
  const handleChange = (e) => {
    const newValue = parseInt(e.target.value);
    onChange(id, newValue);
  };

  return (
    <div className="slider-control">
      <div className="slider-header">
        <span className="control-label">{label}</span>
        <span className="slider-value">{value}%</span>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={handleChange}
        className="slider-input"
      />
      <div className="slider-marks">
        <span>0%</span>
        <span>50%</span>
        <span>100%</span>
      </div>
    </div>
  );
};

export default SliderControl;
