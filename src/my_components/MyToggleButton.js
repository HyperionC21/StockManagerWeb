import React, { useState, forwardRef, useImperativeHandle } from 'react';

const MyToggleButton = (props) => {
    const [toggle, setToggle] = useState(false);
  
    const handleToggle = () => {
        props.cb(!toggle);
        setToggle(!toggle);
    };

  
    return (
      <label>
        <input
          type="radio"
          checked={toggle}
          onClick={handleToggle}
        />
            {toggle ? 'Absolute' : 'Percentage'}
      </label>
    );
  };

export default MyToggleButton;