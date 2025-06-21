import React from "react";
import styles from './Checkbox.module.css'
type Option = {
  label: string;
  value: string;
};

type RequiredType = boolean | { condition: boolean };

type CheckboxGroupProps = {
  name: string;
  options: Option[];
  checked: string[];
  onChange: (newValues: string[]) => void;
  label?: string;
  inline?: boolean;
  disabled?: boolean;
  required?: RequiredType;
  error?: string;
  condition?: boolean; // 👈 new prop to hide the whole component
};

const Checkbox: React.FC<CheckboxGroupProps> = ({
  name,
  options,
  checked,
  onChange,
  label,
  inline = false,
  disabled = false,
  required = false,
  error,
  condition = true,
}) => {
  // If condition is false, skip rendering
  if (!condition) return null;

  const isRequired =
    typeof required === "object" ? required.condition : required === true;

  const handleChange = (value: string) => {
    const updatedValues = checked.includes(value)
      ? checked.filter((v) => v !== value)
      : [...checked, value];
    onChange(updatedValues);
  };

  return (
    <div className="mb-3">
      {label && (
        <label className={`form-label ${styles.label}`}>
          {label} {isRequired && <span className="text-danger">*</span>}
        </label>
      )}
      {options.map((option, idx) => (
        <div
          className={`form-check ${inline ? "form-check-inline me-3" : "mb-2"}`}
          key={idx}
        >
          <input
            className={`form-check-input ${error ? "is-invalid" : ""}`}
            type="checkbox"
            id={`${name}-${idx}`}
            name={name}
            value={option.value}
            checked={checked.includes(option.value)}
            onChange={() => handleChange(option.value)}
            disabled={disabled}
            required={isRequired && checked.length === 0}
            aria-invalid={!!error}
          />
          <label className="form-check-label" htmlFor={`${name}-${idx}`}>
            {option.label}
          </label>
        </div>
      ))}

      {error && <div className="invalid-feedback d-block">{error}</div>}
    </div>
  );
};

export default Checkbox;
