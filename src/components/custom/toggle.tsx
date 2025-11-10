
import React, { useState } from 'react';

interface ToggleButtonProps {
  label: string;
  onClick: () => void; 
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ label, onClick }) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleToggle = () => {
    setIsChecked((prev) => !prev);
    onClick(); // Call the provided onClick handler
  };

  return (
    <div className="flex items-center">
      <label className="flex items-center cursor-pointer">
        <div className="relative">
          <input
            type="checkbox"
            id="toggle"
            className="sr-only"
            checked={isChecked}
            onChange={handleToggle}
          />
          <div
            className={`block ${
              isChecked ? 'bg-blue-500' : 'bg-gray-600'
            } w-14 h-8 rounded-full transition-colors duration-300`}
          ></div>
          <div
            className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-300 transform ${
              isChecked ? 'translate-x-full' : ''
            }`}
          ></div>
        </div>
        <div className="ml-2 mb-[0.5px] items-center text-black font-medium max-sm:hidden">
          {label}
        </div>
      </label>
    </div>
  );
};

export default ToggleButton;
