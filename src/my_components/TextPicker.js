// TextPicker component
import React from 'react';
import Select from 'react-select';

export default function TextPicker(props) {
  // Use props.options instead of a hard coded array
  const options = props.options;
  const onChangeHadler = props.cb;

  const handleChange = (selectedOption) => {
    onChangeHadler(selectedOption.value);
  };

  return (
    <div style={props.style}>
      <Select
        id="text-picker"
        onChange={handleChange}
        options={options}
      />
    </div>
  );
}
