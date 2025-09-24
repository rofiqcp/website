import React from 'react';

const PushButton = ({ id, label, pressed, onPress }) => {
  const handleClick = () => {
    onPress(id);
  };

  return (
    <div className={`push-button ${pressed ? 'pressed' : ''}`} onClick={handleClick}>
      <div className="button-circle">
        {id + 1}
      </div>
      <span className="control-label">{label}</span>
      <span className="status-text">{pressed ? 'PRESSED' : 'READY'}</span>
    </div>
  );
};

export default PushButton;
