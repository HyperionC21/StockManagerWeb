import React from 'react';

const MyToggleButton = ({ cb, value }) => {
  return (
    <div className="toggle-btn-group">
      <button
        className={`period-btn${!value ? ' period-btn--active' : ''}`}
        onClick={() => cb(false)}
      >
        %
      </button>
      <button
        className={`period-btn${value ? ' period-btn--active' : ''}`}
        onClick={() => cb(true)}
      >
        Absolute
      </button>
    </div>
  );
};

export default MyToggleButton;
