import React from 'react';

const STEPS = [
  { value: 7, label: '7d' },
  { value: 30, label: '30d' },
  { value: 90, label: '90d' },
  { value: 180, label: '180d' },
  { value: 365, label: '365d' },
];

const MyDiscreteSlider = ({ onChangeStep, initialValue }) => {
  const [step, setStep] = React.useState(initialValue || 90);

  const handleClick = (value) => {
    setStep(value);
    if (onChangeStep) onChangeStep(value);
  };

  return (
    <div className="period-selector">
      {STEPS.map((s) => (
        <button
          key={s.value}
          className={`period-btn${step === s.value ? ' period-btn--active' : ''}`}
          onClick={() => handleClick(s.value)}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
};

export default MyDiscreteSlider;
