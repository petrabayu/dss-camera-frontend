import React, { useState } from "react";

const PairwiseSlider = ({ criterionA, criterionB, criteriaKey, rowIndex, colIndex, onValueChange }) => {
  const [value, setValue] = useState(9);
  const [showTooltip, setShowTooltip] = useState(false);

  const displayValue = value <= 9 ? 10 - value : value - 8;

  // Reciprocal value calculation
  const leftValue = value <= 9 ? displayValue : displayValue === 1 ? "1" : `1/${displayValue}`;
  const rightValue = value <= 9 ? (displayValue === 1 ? "1" : `1/${displayValue}`) : displayValue;

  // Determine comparison operator
  const comparisonOperator =
    parseFloat(displayValue) === 1 ? "=" : parseFloat(leftValue) > parseFloat(rightValue) ? ">" : "<";

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
      <span className="w-12 text-center font-semibold">{leftValue}</span>
      <div className="text-right text-lg w-[12rem]">{criterionA}</div>

      {/* Slider */}
      <div className="relative w-[32rem] py-1">
        <p className="text-center text-base ">
          {criterionA} {comparisonOperator} {criterionB}
        </p>
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
            className="absolute -top-6 transform translate-x-1/2 bg-gray-800 text-white text-xs font-semibold py-1 px-2 rounded"
            style={{
              left: `${((value + 9) / 18) * 50}%`,
              transform: `translate(-50%, 100%)`, // Menyesuaikan posisi tooltip lebih dekat
            }}
          >
            {displayValue}
          </div>
        )}
      </div>

      {/* Label for Criterion B */}
      <div className="text-left text-lg w-[12rem]">{criterionB}</div>
      <span className="w-12 text-center font-semibold">{rightValue}</span>
    </div>
  );
};

export default PairwiseSlider;
