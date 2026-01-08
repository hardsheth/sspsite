import React, { useState } from "react";
import Select, { MultiValue } from "react-select";

export type Option = {
  label: string;
  value: string;
};

interface MultiInputProps {
  // We ensure the component strictly expects string[]
  value: string[] | any; 
  onChange: (value: string[]) => void;
  placeholder?: string;
}

export const MultiInput: React.FC<MultiInputProps> = ({
  value = [],
  onChange,
  placeholder = "Type and press Enter",
}) => {
  const [inputValue, setInputValue] = useState("");

  // FIX: Force convert any incoming objects into strings to prevent [object Object]
  // This handles cases where React Hook Form might have stale object data
  const selectValue: Option[] = Array.isArray(value) 
    ? value.map((v) => {
        const stringValue = typeof v === 'object' ? (v?.value || "") : String(v);
        return {
          label: stringValue,
          value: stringValue,
        };
      })
    : [];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!inputValue) return;

    if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      
      const currentValues = Array.isArray(value) ? value : [];
      
      // Prevent adding duplicates
      if (!currentValues.includes(inputValue)) {
        onChange([...currentValues, inputValue]);
      }
      
      setInputValue(""); 
    }
  };

  return (
    <Select<Option, true>
      instanceId="multi-input-select" // Prevents hydration mismatch errors
      isMulti
      value={selectValue}
      inputValue={inputValue} 
      onInputChange={(val) => setInputValue(val)}
      onChange={(newVal: MultiValue<Option>) => {
        // Always send a clean array of strings back to the form
        onChange(newVal ? newVal.map((opt) => opt.value) : []);
      }}
      onKeyDown={handleKeyDown}
      menuIsOpen={false}
      placeholder={placeholder}
      components={{ 
        DropdownIndicator: null,
        IndicatorSeparator: null 
      }}
      // Explicitly tell Select which primitive to use for the React Key
      getOptionLabel={(opt) => opt.label}
      getOptionValue={(opt) => opt.value}
    />
  );
};

export default MultiInput;