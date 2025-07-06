import React from 'react';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';

const MyDiscreteSlider = ({ onChangeStep, initialValue }) => {
  const [step, setStep] = React.useState(initialValue || 90);

  const marks = [
    { value: 7, label: '7' },
    { value: 30, label: '30' },
    { value: 90, label: '90' },
    { value: 180, label: '180' },
    { value: 365, label: '365' },
  ];

  const handleChange = (_, newValue) => {
    setStep(newValue);
    if (onChangeStep) {
      onChangeStep(newValue);
    }
  };

  return (
    <div>
      <Slider
        value={step}
        onChange={handleChange}
        step={null} // Disabling default step behavior
        marks={marks}
        min={7}
        max={365}
        valueLabelDisplay="auto"
        aria-labelledby="discrete-slider"
      />
    </div>
  );
};

export default MyDiscreteSlider;