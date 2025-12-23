"use client";
import React, { useState } from "react";
import { InputProps } from "../input/InputField";
import Label from "../Label";

interface VoiceInputProps extends InputProps {
  require?: boolean;
  label: string;
}

const VoiceInput: React.FC<VoiceInputProps> = ({
  placeholder = "+1 (555) 000-0000",
  type,
  id,
  name,
  onChange,
  min,
  max,
  disabled,
  label,
  require = false,
}) => {
  return (
    <div>
      <Label>{label} {require && <span className="text-red-500">*</span>}</Label>
      <div className="relative flex">
        {/* Input field */}
        <input
          type={type}
          id={id}
          name={name}
          placeholder={placeholder}
          disabled={disabled}
          onChange={onChange}
          min={min}
          max={max}
          className={`dark:bg-dark-900 h-11 w-full pr-[84px] rounded-lg border border-gray-300 bg-transparent py-3 px-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800`}
        />

        <div className="absolute right-0">

          <div className="absolute inset-y-0 flex items-center text-gray-700 pointer-events-none right-3 dark:text-gray-400">

          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceInput;
