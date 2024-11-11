import React, { useState } from "react";

const PairwiseSlider = ({ criterionA, criterionB, criteriaKey, rowIndex, colIndex, onValueChange }) => {
  const [value, setValue] = useState(9);
  const [showTooltip, setShowTooltip] = useState(false);

  const displayValue = value <= 9 ? 10 - value : value - 8;

  // Handle slider value change
  const handleChange = (e) => {
    const newValue = parseInt(e.target.value);

    const adjustedValue = newValue <= 9 ? 10 - newValue : newValue - 8;
    const mappedValue = adjustedValue * (newValue < 9 ? -1 : 1);

    setValue(newValue);

    if (onValueChange) {
      onValueChange(mappedValue, criteriaKey, rowIndex, colIndex);
    }
  };

  return (
    <div className="flex items-center justify-between space-x-4">
      {/* Label for Criterion A */}
      <div className="text-right w-20">{criterionA}</div>

      {/* Slider */}
      <div className="relative w-3/4">
        <input
          type="range"
          min="1"
          max="17"
          value={value}
          onChange={handleChange}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className="w-full"
        />

        {/* Tooltip */}
        {showTooltip && (
          <div
            className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs font-semibold py-1 px-2 rounded"
            style={{ left: `${((value + 9) / 18) * 100}%` }}
          >
            {displayValue}
          </div>
        )}
      </div>

      {/* Label for Criterion B */}
      <div className="text-left w-20">{criterionB}</div>
      <span className="w-12 text-center font-semibold">{displayValue}</span>
    </div>
  );
};

export default PairwiseSlider;
