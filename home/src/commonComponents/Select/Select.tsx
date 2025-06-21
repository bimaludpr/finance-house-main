"use client";

import React from "react";
import { MultiSelect } from "react-multi-select-component";
import style from './Select.module.css';
import SelectType, { Props as SelectPropsType } from "react-select";

type OptionType = {
  label?: string;
  value?: string | number;
  [key: string]: any;
};

const SelectComponent = SelectType as unknown as React.FC<SelectPropsType<OptionType>>;

type SelectProps = {
  title?: string;
  placeholder?: string;
  options: OptionType[];
  value: any;
  labelSetter: (item: OptionType) => string;
  valueSetter: (item: OptionType) => string | number;
  onChange: (value: any) => void;
  className?: string;
  isMulti?: boolean;
  Multi2?: boolean;
  required?: boolean;
};

const Select: React.FC<SelectProps> = ({
  title,
  placeholder = "Select",
  options,
  value,
  labelSetter,
  valueSetter,
  onChange,
  className = "",
  isMulti = false,
  Multi2 = false,
  required = false,
}) => {
  const mappedOptions = options.map((opt) => ({
    ...opt,
    label: labelSetter(opt),
    value: valueSetter(opt),
  }));

  const matchedValue = Multi2
    ? (value || [])
      .map((val: any) =>
        mappedOptions.find((opt) => valueSetter(opt) === valueSetter(val))
      )
      .filter(Boolean)
    : mappedOptions.find((opt) => valueSetter(opt) === valueSetter(value));


  return (
    <div className={`w-full ${className}`}>
      {title && (
        <label className={style.label}>
          {title}
          {required && <span className="text-red-600 ml-1">*</span>}
        </label>
      )}

      {Multi2 ? (
        <MultiSelect
          options={mappedOptions}
          value={matchedValue}
          onChange={onChange}
          labelledBy={placeholder}
          hasSelectAll={false}
          overrideStrings={{ selectSomeItems: placeholder }}

        />
      ) : (
        <SelectComponent
          options={mappedOptions}
          value={matchedValue}
          onChange={onChange}
          placeholder={placeholder}
          isMulti={isMulti}

          getOptionLabel={(e: OptionType) => e.label ?? ""}
          getOptionValue={(e: OptionType) => String(e.value)}
        />
      )}
    </div>
  );
};

export default Select;
