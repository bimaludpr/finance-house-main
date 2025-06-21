import React from "react";
import styles from './RadioButton.module.css'
type Option = {
  label: string;
  value: string;
};

type RequiredType = boolean | { condition: boolean };

type RadioGroupProps = {
  name: string;
  options: Option[];
  checked?: string;
  onChange: (value: string) => void;
  label?: string;
  inline?: boolean;
  disabled?: boolean;
  required?: RequiredType;
  error?: string;
  condition?: boolean; // Controls rendering
};

const RadioButton: React.FC<RadioGroupProps> = ({
  name,
  options,
  checked,
  onChange,
  label,
  inline = false,
  disabled = false,
  required,
  error,
  condition = true,
}) => {
  if (!condition) return null;

  const isRequired =
    typeof required === "object" ? required.condition : required === true;

  // Validate the checked value is within the allowed options
  const isValidValue = options.some((opt) => opt.value === checked);

  return (
    <div className="mb-3">
      {label && (
        <label className={styles.label}>
          {label} {isRequired && <span className="text-danger">*</span>}
        </label>
      )}

      <div className={inline ? "d-flex" : "d-block"}>
        {options.map((option, idx) => (
          <div
            className={`form-check align-items-center ${inline ? "me-3" : "mb-2"
              }`}
            key={idx}
          >
            <input
              className={`form-check-input ${error ? "is-invalid" : ""}`}
              type="radio"
              name={name}
              id={`${name}-${idx}`}
              value={option.value}
              checked={checked === option.value}
              onChange={() => onChange(option.value)}
              disabled={disabled}
              required={isRequired}
              aria-invalid={!!error}
            />
            <label className="form-check-label" htmlFor={`${name}-${idx}`}>
              {option.label}
            </label>
          </div>
        ))}
      </div>

      {error && (
        <div className="invalid-feedback d-block">
          {error || "Invalid selection"}
        </div>
      )}
    </div>
  );
};

export default RadioButton;
